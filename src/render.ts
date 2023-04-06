
import { DateTime } from "luxon";
import Calendar from "./components/Calendar.svelte";
import type { DataSource } from "./types";



export function render_calendar(container: HTMLElement, sources : DataSource[] ) : Calendar{
    return new Calendar({
        target: container,
        props: {
            sources,
            today: DateTime.local()
        },
    })
}