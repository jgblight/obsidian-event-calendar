<script lang="ts">
    import ItemList from "./ItemList.svelte";
    import type { DateTime } from "luxon";
    import type { DataSourceCollection } from "../types";
	import { getNextNDays } from "src/date_utils";

    export let collection: DataSourceCollection;
    export let today: DateTime;

    let days = getNextNDays(today, 7)
</script>

<div class="agenda">
    {#each days as day}
        {#await collection.dayHasData(day)}
            <div/>
        {:then has_data} 
            {#if has_data}
                <div>
                    <h5>{day.toLocaleString({ weekday: 'long', month: 'long', day: '2-digit' })}</h5>
                    <ItemList collection={collection} day={day} indent={true}/>
                </div>
            {/if}
        {/await}
    {/each}
</div>

<style>
    h5 {
        margin-bottom: 0;
    }
</style>