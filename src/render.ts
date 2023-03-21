
import type { QueryResult } from "obsidian-dataview/lib/api/plugin-api";
import Agenda from "./components/Agenda.svelte"



export function render_agenda(container: HTMLElement, query: QueryResult) : Agenda{
    const items = query.values.map((item) => item.value.text);
    return new Agenda({
        target: container,
        props: {
            items
        },
    })
}