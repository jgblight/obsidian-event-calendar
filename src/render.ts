
import Agenda from "./components/Agenda.svelte"
import type { DateItem } from "./parse"



export function render_agenda(container: HTMLElement, items: DateItem[]) : Agenda{
    const dateMap = new Map<string, DateItem[]>;
    for (const item of items) {
        const day = item.date.toFormat("DDD");
        if (!dateMap.has(day)) {
            dateMap.set(day, [item]);
        } else {
            dateMap.get(day)?.push(item);
        }
    }
    return new Agenda({
        target: container,
        props: {
            dateMap
        },
    })
}