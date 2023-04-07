<script lang="ts">
  import type { DateTime } from "luxon";
  import Bullet from "./Bullet.svelte";
  import type { DataSource } from "../types"

  export let sources: DataSource[];
  export let day: DateTime;
  
</script>

<ul>
  {#each sources as source}
    {#each source.get_day(day) as item}
        <li><Bullet color={source.color} /> {item.text}</li>
    {/each}
  {/each}
</ul>

<style>
  ul {
    list-style: none; /* Remove default bullets */
    margin: 0;
    padding-inline-start: 0px;
  }
  ul li {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>