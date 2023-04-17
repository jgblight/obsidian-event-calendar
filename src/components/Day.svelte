<script lang="ts">
    import type { DateTime } from "luxon";
    import ItemList from "./ItemList.svelte";
    import type { DataSource } from "../types";
    import { createEventDispatcher } from 'svelte';

    export let day: DateTime|null;
    export let sources: DataSource[];

    let referenceElement : HTMLElement;

    let has_data : boolean = false;
    $: has_data = !!day && sources.some((s) => s.get_day(day).length >= 1)

    const dispatch = createEventDispatcher();

    function hoverDay() {
      if (has_data) {
        dispatch('hoverDay', {
          day: day,
          element: referenceElement
        });
      }
    }

    function endHover() {
      if (has_data) {
        dispatch('endHover', {
          day: day,
          element: referenceElement
        });
      }
    }
</script>

<td class="day">
{#if day}
    <div on:pointerenter={hoverDay} on:focus={hoverDay} on:pointerleave={endHover} bind:this={referenceElement} class="content">
        <div class="day_number">{day.day}</div>
        <ItemList sources={sources} day={day} isCalendar={true}/>
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
  }
</style>