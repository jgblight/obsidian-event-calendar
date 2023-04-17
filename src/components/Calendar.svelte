<script lang="ts">
  import { DateTime, Info } from "luxon";
    import { debounce } from "obsidian";
    import Day from "./Day.svelte";
    import Arrow from "./Arrow.svelte";
	  import HoverBox from "./HoverBox.svelte";
    import type { DataSource } from "../types";
    import { get_month_grid } from "../date_utils";
    import { parse } from "../parse";

    export let source_str: string;
    export let today: DateTime;
    let year = today.year;
    let month = today.month;

    let sources : DataSource[] = [];
    parse(source_str).map((promise) => {
      promise.then((source) => {
        sources.push(source);
        sources = sources;  // assignment triggers render
      });
    });

    let selectedDay = today;
    let referenceElement : HTMLElement|null;
    let popoverVisible = false;
    let popoverTimeout : number;

    function prev_month() {
      month = month - 1;
      if (month == 0) {
        year = year - 1;
        month = 12;
      }
    }

    function next_month() {
      month = month + 1;
      if (month == 13) {
        year = year + 1;
        month = 1;
      }
    }

    function hoverDay(event : CustomEvent) {
      // Track the day that the user is currently hovering over
      // If same day is hover for more than the timeout period, open the popover
      const eventElement = event.detail.element;

      if (eventElement !== referenceElement) {
        selectedDay = event.detail.day;
        referenceElement = eventElement;
      }

      if (!popoverVisible) {
        window.clearTimeout(popoverTimeout);
        popoverTimeout = window.setTimeout(() => {
          if (referenceElement === eventElement) {
            popoverVisible = true;
          }
        }, 750);
      }
      popoverVisible = true;
	  }

    const dismissPopover = debounce(
      (event: CustomEvent) => {
        // if the user didn't hover onto another day
        if (referenceElement === event.detail.element) {
          referenceElement = null;
          popoverVisible = false;
        }
      },
      750,
      true
    );

</script>

<div id="calendar-container" class="container">
  <div class="heading">
    <span class="year">{year}</span>
  </div>
  <div class="heading">
    <button on:click={prev_month}><Arrow direction="left"/></button>
    <span class="month">{Info.months()[month-1]}</span>
    <button on:click={next_month}><Arrow direction="right"/></button>
  </div>
  <table class="calendar">
    <thead>
      <tr>
        {#each Info.weekdays('short') as dayOfWeek}
          <th>{dayOfWeek}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each get_month_grid(year, month) as week (week.week_no)}
        <tr>
          {#each Info.weekdays('short') as d}
            <Day day={week.days.has(d) ? week.days.get(d) : null} sources={sources} on:hoverDay={hoverDay} on:endHover={dismissPopover}/>
          {/each} 
        </tr>
      {/each}
    </tbody>
  </table>
</div>
<div>
  <HoverBox referenceElement={referenceElement} sources={sources} day={selectedDay} visible={popoverVisible} />
</div>

<style>
  .container {
    padding: 0 8px;
  }
  .heading {
    text-align: center;
  }
  .month {
    font-size: var(--font-ui-large);
    font-weight: var(--font-bold);
    color: var(--h5-color);
  }
  .year {
    font-size: var(--font-ui-small);
  }
  .calendar {
    border-collapse: collapse;
    width: 100%;
  }
  table {
    table-layout: fixed;
  }
  th {
    font-size: 0.6em;
    letter-spacing: 1px;
    padding: 4px;
    text-align: center;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  button {
    border: none;
    background-color: transparent;
    font-family: inherit;
    padding: 0;
    cursor: pointer;
    display: inline;
    box-shadow: none;
    color: var(--text-muted);
  }
</style>