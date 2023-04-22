import { Plugin } from "obsidian";
import { render_agenda, render_calendar } from "src/render";

export default class EventCalendar extends Plugin {
	async onload() {
		let calendar = this.registerMarkdownCodeBlockProcessor(
			"calendar",
			async (source, el, ctx) => {
				render_calendar(el, source);
			}
		);
		calendar.sortOrder = -100;

		let agenda = this.registerMarkdownCodeBlockProcessor(
			"agenda",
			async (source, el, ctx) => {
				render_agenda(el, source, this.app);
			}
		);
		agenda.sortOrder = -100;
	}

	onunload() {}
}
