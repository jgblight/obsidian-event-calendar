import { DateTime } from "luxon";
import type { App } from "obsidian";
import Agenda from "./components/Agenda.svelte";
import Calendar from "./components/Calendar.svelte";

export function render_calendar(
	container: HTMLElement,
	source_str: string
): Calendar {
	return new Calendar({
		target: container,
		props: {
			source_str,
			today: DateTime.local(),
		},
	});
}

export function render_agenda(
	container: HTMLElement,
	source_str: string,
	app: App
): Calendar {
	return new Agenda({
		target: container,
		props: {
			source_str,
			app,
			today: DateTime.local(),
		},
	});
}
