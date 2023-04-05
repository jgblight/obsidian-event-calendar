<script lang="ts">
    import ItemList from "./ItemList.svelte";
    import type { DataSource } from "../types"

    export let sources: DataSource[];
    let key_set = new Set();
    sources.forEach(source => [...source.dateMap.keys()].forEach(day => key_set.add(day)));
    console.log(key_set);
</script>

<div class="agenda">
    {#each [...key_set] as key}
        <div>
            <h4>{key}</h4>
            {#each sources as source}
                <ItemList source={source} date={key} />
            {/each}
        </div>
    {/each}
</div>