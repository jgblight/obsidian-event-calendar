import { Plugin } from "obsidian";
import { render_agenda, render_calendar } from "src/render";

export default class EventCalendar extends Plugin {
	async onload() {
		this.registerMarkdownCodeBlockProcessor(
			"calendar",
			(source, el, ctx) => {
				render_calendar(el, source);
			}
		);
		this.registerMarkdownCodeBlockProcessor("agenda", (source, el, ctx) => {
			render_agenda(el, source, this.app);
		});
	}

	onunload() {}
}
