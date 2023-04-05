
import Agenda from "./components/Agenda.svelte";
import Calendar from "./components/Calendar.svelte";
import type { DataSource } from "./types";



export function render_agenda(container: HTMLElement, sources : DataSource[] ) : Calendar{
    return new Calendar({
        target: container,
        props: {
            sources
        },
    })
}