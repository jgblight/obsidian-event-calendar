<script lang="ts">
  import type { DateTime } from "luxon";
  import Bullet from "./Bullet.svelte";
  import type { DataSource, DateItem } from "../types"
  import { createEventDispatcher } from "svelte";

  export let sources: DataSource[];
  export let day: DateTime;
  export let indent : boolean = false;
  export let small : boolean = false;
  
  const dispatch = createEventDispatcher();

  function onClick(item: DateItem) {
      dispatch('clickListItem', {
        item: item
      });
  }

  function onHover(item: DateItem, element: HTMLElement) {
      dispatch('hoverListItem', {
        item: item,
        element: element
      });
  }

</script>

<ul class={indent ? "" : "indent"}>
  {#each sources as source}
    {#each source.get_day(day) as item}
        <li on:click={() => onClick(item)} on:pointerenter={(event) => onHover(item, event.currentTarget)}><Bullet color={source.color} size={small ? 12 : 16}/> {item.text}</li>
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
</style>