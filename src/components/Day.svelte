<script lang="ts">
    import type { DateTime } from "luxon";
    import ItemList from "./ItemList.svelte";
    import type { CalendarState } from "../state";
    import { createEventDispatcher } from 'svelte';

    export let day: DateTime|null|undefined;
    export let state: CalendarState;
    export let today: DateTime;

    let is_today = day && today.hasSame(day, "day");
    let referenceElement : HTMLElement;

    let has_data : boolean = false;
    $: {
      if (day) {
        state.dayHasData(day).then((x) => {has_data = x})
      }
    } 

    const dispatch = createEventDispatcher();

    function hoverDay() {
      if (has_data) {
        dispatch('hoverDay', {
          date: day,
          element: referenceElement
        });
      }
    }

    function endHover() {
      if (has_data) {
        dispatch('endHover', {
          date: day,
          element: referenceElement
        });
      }
    }
</script>

<td class={is_today ? "day today" : "day" }>
{#if day}
    <div on:pointerenter={hoverDay} on:focus={hoverDay} on:pointerleave={endHover} bind:this={referenceElement} class="content">
        <div class="day_number">{day.day}</div>
        <ItemList state={state} day={day} small={true}/>
    </div>
{/if}
</td>

<style>
  .day {
    cursor: pointer;
    font-size: 0.8em;
    padding: 4px;
    position: relative;
    transition: background-color 0.1s ease-in, color 0.1s ease-in;
    vertical-align: top;
    height: 100px;
    text-overflow: ellipsis;
    white-space: normal;
  }
  .content {
    height: 100%;
  }
  .day:hover {
    background-color: var(--interactive-hover);
  }
  .day_number {
    color: var(--text-muted);
    text-align: right;
    vertical-align: top;
    margin-bottom: 5px;
  }
  .today {
    background-color: color-mix(in srgb, var(--interactive-accent) 30%, transparent) !important;
  }
</style>