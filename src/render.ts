import { App, MarkdownRenderChild } from "obsidian";
import { DateTime } from "luxon";
import Calendar from "./components/Calendar.svelte";
import { DataSourceCollection } from "./types";
import type { CalendarSettings } from "./settings";
import { parseDataSources } from "./parse";

export class CalendarRenderChild extends MarkdownRenderChild {
	private collection: DataSourceCollection;
	private today: DateTime;
	private year: number;
	private month: number;

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
		this.collection = new DataSourceCollection(
			parseDataSources(this.source),
			this.app,
			dv,
			this.settings
		);
		this.today = DateTime.local();
		this.year = this.today.year;
		this.month = this.today.month;
	}

	onload(): void {
		this.updateData();
		this.registerEvent(
			this.app.workspace.on("dataview:refresh-views", this.updateData.bind(this))
		);
	}

    private prev_month() {
		this.month = this.month - 1;
		if (this.month == 0) {
			this.year = this.year - 1;
			this.month = 12;
		}
		this.render();
	}
  
	private next_month() {
		this.month = this.month + 1;
		if (this.month == 13) {
			this.year = this.year + 1;
			this.month = 1;
		}
		this.render();
	}

	private async updateData() {
		this.collection.updateCache(this.render.bind(this));
	}

	private async render() {
		while (this.containerEl.firstChild) {
			this.containerEl.removeChild(this.containerEl.firstChild);
		}
		const props = {
			collection: this.collection,
			today: DateTime.local(),
			year: this.year,
			month: this.month,
			prev_month_callback: this.prev_month.bind(this),
			next_month_callback: this.next_month.bind(this),
		};
		new Calendar({
			target: this.containerEl,
			props: props,
		});
	}
}
