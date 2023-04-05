<script lang="ts">
    import { DateTime, Info } from "luxon";
    import ItemList from "./ItemList.svelte";
    import type { DataSource } from "../types";

    export let day: DateTime|null;
    export let sources: DataSource[];
</script>

<td class="day">
{#if day}
    <div>
        <div class="day_number">{day.day}</div>
        {#each sources as source}
            <ItemList source={source} date={day.toFormat("DDD")} />
        {/each}
    </div>
{/if}
</td>

<style>
  .day {
    cursor: pointer;
    font-size: 0.8em;
    height: 100%;
    padding: 4px;
    position: relative;
    transition: background-color 0.1s ease-in, color 0.1s ease-in;
    vertical-align: top;
    max-width: 100px;
    text-overflow: ellipsis;
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