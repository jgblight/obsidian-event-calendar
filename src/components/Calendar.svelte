<script lang="ts">
  import { DateTime, Info } from "luxon";
    import { debounce } from "obsidian";
    import Day from "./Day.svelte";
    import Arrow from "./Arrow.svelte";
	  import HoverBox from "./HoverBox.svelte";
    import type { CalendarState, DateElement } from "../state";
    import { getMonthGrid } from "../date_utils";

    export let state: CalendarState;
    export let today: DateTime;
    export let prev_month_callback: () => void;
    export let next_month_callback: () => void;


    let year = state.year;
    let month = state.month;

    // Track popover state
    let activeDateElement : DateElement|null = null;
    let popoverVisible : boolean = false;
    let popoverTimeout : number;
    let pointerInPopover : boolean = false;
    let pointerInActiveDate : boolean = false;

    function hoverDay(event : CustomEvent) {
      // Track the day that the user is currently hovering over
      // If same day is hover for more than the timeout period, open the popover
      const eventElement = event.detail;

      if (eventElement !== activeDateElement) {
        activeDateElement = eventElement;
        pointerInActiveDate = true;
      }

      if (!popoverVisible) {
        window.clearTimeout(popoverTimeout);
        popoverTimeout = window.setTimeout(() => {
          if (activeDateElement === eventElement) {
            popoverVisible = true;
          }
        }, 250);
      }
	  }

    const dismissPopover = debounce(
      (dateElement: DateElement) => {
        // if the user didn't hover onto another day
        if (activeDateElement && activeDateElement.element === dateElement.element && !pointerInPopover && !pointerInActiveDate) {
          activeDateElement = null;
          popoverVisible = false;
        }
      },
      750,
      true
    );

    function exitPopover() {
      pointerInPopover = false;
      if (activeDateElement) { dismissPopover(activeDateElement)}
    }

    function exitDay(event: CustomEvent) {
      pointerInActiveDate = false;
      if (activeDateElement) { dismissPopover(event.detail)}
    }

</script>

<div id="calendar-container" class="container">
  <div class="heading">
    <span class="year">{year}</span>
  </div>
  <div class="heading">
    <button on:click={prev_month_callback}><Arrow direction="left"/></button>
    <span class="month">{Info.months()[month-1]}</span>
    <button on:click={next_month_callback}><Arrow direction="right"/></button>
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
      {#each getMonthGrid(year, month) as week (week.week_no)}
        <tr>
          {#each Info.weekdays('short') as d}
            <Day day={week.days.has(d) ? week.days.get(d) : null} state={state} today={today} on:hoverDay={hoverDay} on:endHover={exitDay}/>
          {/each} 
        </tr>
      {/each}
    </tbody>
  </table>
</div>
<HoverBox state={state} activeDateElement={activeDateElement} visible={popoverVisible} on:enterPopover={() => {pointerInPopover = true}} on:exitPopover={exitPopover}/>


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