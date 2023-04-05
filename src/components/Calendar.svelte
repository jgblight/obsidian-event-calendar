<script lang="ts">
    import { DateTime, Info } from "luxon";
    import Day from "./Day.svelte";
    import type { DataSource } from "../types";
    import { get_day_for_calendar_index } from "../date_utils";

    export let sources: DataSource[];
    export let year: number;
    export let month: number;

    function getDay(row: number, col: number) : DateTime {
        return get_day_for_calendar_index(2023, 3, row*7 + col);
    }

    let daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];
</script>

<div id="calendar-container" class="container">
  <table class="calendar">
    <thead>
      <tr>
        {#each daysOfWeek as dayOfWeek}
          <th>{dayOfWeek}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each [0,1,2,3,4] as row}
        <tr>
          {#each [0,1,2,3,4,5,6] as col}
            <Day day={getDay(row, col)} sources={sources} />
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .container {
    padding: 0 8px;
  }
  .calendar {
    border-collapse: collapse;
    width: 100%;
  }
  th {
    font-size: 0.6em;
    letter-spacing: 1px;
    padding: 4px;
    text-align: center;
    text-transform: uppercase;
  }
</style>