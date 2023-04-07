<script lang="ts">
import ItemList from "./ItemList.svelte";
import Popover from "./Popover.svelte";
import type { DataSource } from "../types";
import type { DateTime } from "luxon";

export let referenceElement : HTMLElement|null;
export let visible : boolean;
export let sources : DataSource[];
export let day : DateTime;
</script>

<Popover
  referenceElement={referenceElement}
  isVisible={visible}
>
  <div class="popover">
    <ItemList sources={sources} day={day} />
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