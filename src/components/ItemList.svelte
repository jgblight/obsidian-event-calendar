<script lang="ts">
  import type { DateTime } from "luxon";
  import Bullet from "./Bullet.svelte";
  import type { DateItem } from "../query";
  import type { CalendarState } from "../state";

  export let state: CalendarState;
  export let day: DateTime;
  export let indent : boolean = false;
  export let small : boolean = false;

  function onClick(item: DateItem) {
    state.clickItem(item);
  }

  function onHover(item: DateItem, element: HTMLElement) {
    state.hoverItem(item, element);
  }

</script>

<ul class={indent ? "" : "indent"}>
  {#await state.getDay(day)}
    <div/>
  {:then items} 
    {#each items as item}
        <li>
          <Bullet color={item.color} size={small ? 12 : 16} /> 
          {item.text} 
          {#if !small}
            <span class="link" on:click={() => onClick(item)} on:pointerenter={(event) => onHover(item, event.currentTarget)}>({item.displayText()})</span>
          {/if}
        </li>
    {/each}
  {/await}
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