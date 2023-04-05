<script lang="ts">
  import Bullet from "./Bullet.svelte";
  import type { DataSource } from "../types"

  export let source: DataSource;
  export let day: DateTime;

  let formatted = day.toFormat("DDD");
  let items = source.dateMap.has(formatted) ? source.dateMap.get(formatted) : [];
</script>

<ul>
  {#each items as item}
      <li><Bullet color={source.color} /> {item.text}</li>
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