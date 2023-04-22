<script lang="ts">
import ItemList from "./ItemList.svelte";
import Popover from "./Popover.svelte";
import type { DataSourceCollection, DateElement } from "../types";
import type { DateTime } from "luxon";
	import { element } from "svelte/internal";

export let activeDateElement : DateElement|null;
export let visible : boolean;
export let collection: DataSourceCollection;
</script>

<Popover
referenceElement={activeDateElement?.element}
isVisible={visible}
on:enterPopover on:exitPopover
>
<div class="popover">
  {#if activeDateElement}
    <ItemList collection={collection} day={activeDateElement.date} />
  {/if}
</div>
</Popover>


<style>
  .popover {
    background-color: var(--background-primary);
    border-radius: 4px;
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.25);
    color: var(--text-normal);
    display: flex;
    flex-direction: column;
    padding: 24px;
  }
</style>