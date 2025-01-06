import { App, MarkdownRenderChild } from "obsidian";
import { DateTime } from "luxon";
import Calendar from "./components/Calendar.svelte";
import { CalendarState } from "./state";
import type { CalendarSettings } from "./settings";
import { parseDataSources } from "./query";

export class CalendarRenderChild extends MarkdownRenderChild {
	private state: CalendarState;
	private today: DateTime;

	constructor(
		container: HTMLElement,
		private app: App,
		private source: string,
		private settings: CalendarSettings,
	) {
		super(container);

		const dv = app.plugins.plugins.dataview?.api;
		if (dv == undefined) {
			throw new Error("No DataviewApi available");
		}
		this.today = DateTime.local();
		this.state = new CalendarState(
			parseDataSources(this.source),
			this.app,
			dv,
			this.settings,
			this.today.year,
			this.today.month
		);
	}

	onload(): void {
		this.updateData();
		this.registerEvent(
			this.app.workspace.on("dataview:refresh-views", this.updateData.bind(this))
		);
	}

    private prev_month() {
		this.state.prev_month().then(() => this.render());
	}
  
	private next_month() {
		this.state.next_month().then(() => this.render());
	}

	private async updateData() {
		this.state.updateCache(this.render.bind(this));
	}

	private async render() {
		while (this.containerEl.firstChild) {
			this.containerEl.removeChild(this.containerEl.firstChild);
		}
		const props = {
			state: this.state,
			today: DateTime.local(),
			prev_month_callback: this.prev_month.bind(this),
			next_month_callback: this.next_month.bind(this),
		};
		new Calendar({
			target: this.containerEl,
			props: props,
		});
	}
}
