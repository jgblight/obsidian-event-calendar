<script lang="ts">
  import type { DateTime } from "luxon";
  import Bullet from "./Bullet.svelte";
  import type { DataSource } from "../types"

  export let sources: DataSource[];
  export let day: DateTime;
  export let isCalendar: boolean = false;
  
</script>

<ul class={isCalendar ? "calendar" : "agenda"}>
  {#each sources as source}
    {#each source.get_day(day) as item}
        <li><Bullet color={source.color} size={isCalendar ? 12 : 16}/> {item.text}</li>
    {/each}
  {/each}
</ul>

<style>
  ul {
    list-style: none; /* Remove default bullets */
    margin: 0;
  }
  .calendar {
    padding-inline-start: 0px;
  }
  ul li {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>