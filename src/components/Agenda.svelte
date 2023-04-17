<script lang="ts">
    import ItemList from "./ItemList.svelte";
    import { DateTime, Duration } from "luxon";
    import type { DataSource } from "../types";
    import { parse } from "../parse";

    export let source_str: string;
    export let today: DateTime;

    let sources : DataSource[] = [];
    parse(source_str).map((promise) => {
      promise.then((source) => {
        sources.push(source);
        sources = sources;  // assignment triggers render
      });
    });
    let days = [...Array(7).keys()].map(d => today.plus(Duration.fromObject({days:d})));
</script>

<div class="agenda">
    {#each days as day}
        <div>
            <h5>{day.toFormat("DDD")}</h5>
            <ItemList sources={sources} day={day} />
        </div>
    {/each}
</div>

<style>
    h5 {
        margin-bottom: 0;
    }
</style>