<script lang="ts">
import ItemList from "./ItemList.svelte";
import type { DateItem } from "../parse"

  export let dateMap: Map<string, DateItem[]>;
</script>

<div class="agenda">
    {#each [...dateMap] as [key, value]}
        <div>
            <h4>{key}</h4>
            <ItemList items={value}/>
        </div>
    {/each}
</div>