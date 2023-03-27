<script lang="ts">
import Bullet from "./Bullet.svelte";
import type { DateItem } from "../parse"

  export let items: DateItem[];
</script>

<ul>
  {#each items as item}
      <li><Bullet color={item.color} /> {item.text}</li>
  {/each}
</ul>

<style>
  ul {
    list-style: none; /* Remove default bullets */
  }
</style>