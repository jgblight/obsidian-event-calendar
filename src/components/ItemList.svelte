<script lang="ts">
  import type { DateTime } from "luxon";
  import Bullet from "./Bullet.svelte";
  import type { DataSourceCollection, DateItem } from "../types";

  export let collection: DataSourceCollection;
  export let day: DateTime;
  export let indent : boolean = false;
  export let small : boolean = false;

  function onClick(item: DateItem) {
    collection.clickItem(item);
  }

  function onHover(item: DateItem, element: HTMLElement) {
    collection.hoverItem(item, element);
  }

</script>

<ul class={indent ? "" : "indent"}>
  {#each collection.sources as source}
    {#each source.get_day(day) as item}
        <li>
          <Bullet color={source.color} size={small ? 12 : 16} /> 
          {item.text} 
          {#if !small}
            <span class="link" on:click={() => onClick(item)} on:pointerenter={(event) => onHover(item, event.currentTarget)}>({item.displayText()})</span>
          {/if}
        </li>
    {/each}
  {/each}
</ul>

<style>
  ul {
    list-style: none; /* Remove default bullets */
    margin: 0;
  }
  .indent {
    padding-inline-start: 0px;
  }
  ul li {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .link {
    cursor: pointer;
    color: var(--text-link);
  }
</style>