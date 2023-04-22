<script lang="ts">
    import ItemList from "./ItemList.svelte";
    import type { DateTime } from "luxon";
    import type { DataSource } from "../types";
    import type { App } from "obsidian";
	import { getNextNDays } from "src/date_utils";

    export let sources: DataSource[];
    export let today: DateTime;
    export let app: App;

    let days = getNextNDays(today, 7);

    function onHoverListItem(event : CustomEvent) {
        const eventItem = event.detail.item;
        app.workspace.trigger("link-hover", {}, event.detail.element, eventItem.path, eventItem.path)
	}

    function onClickListItem(event : CustomEvent) {
        const eventItem = event.detail.item;
        const file = app.metadataCache.getFirstLinkpathDest(eventItem.path, "");
        if (file == null) {
            return;
        }
        const leaf = app.workspace.getLeaf(true);
        leaf.openFile(file, { active: true });
	}
</script>

<div class="agenda">
    {#each days as day}
        <div>
            <h5>{day.toFormat("DDD")}</h5>
            <ItemList sources={sources} day={day} indent={true} on:clickListItem={onClickListItem} on:hoverListItem={onHoverListItem}/>
        </div>
    {/each}
</div>

<style>
    h5 {
        margin-bottom: 0;
    }
</style>