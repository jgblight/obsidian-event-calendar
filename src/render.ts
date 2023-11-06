import { App, MarkdownRenderChild } from "obsidian";
import { DateTime } from "luxon";
import Agenda from "./components/Agenda.svelte";
import Calendar from "./components/Calendar.svelte";
import { DataSourceCollection } from "./types";
import type { CalendarSettings } from "./settings";
import { parseDataSources } from "./parse";

export enum RenderType {
	Calendar,
	Agenda,
}

export class CalendarRenderChild extends MarkdownRenderChild {
	private collection: DataSourceCollection;

	constructor(
		container: HTMLElement,
		private app: App,
		private source: string,
		private settings: CalendarSettings,
		private renderType: RenderType
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
	}

	onload(): void {
		this.render();
		this.registerEvent(
			this.app.workspace.on("calendar-update", () => {
				this.render();
			})
		);
	}

	private async render() {
		this.collection.updateCache().then(() => {
			while (this.containerEl.firstChild) {
				this.containerEl.removeChild(this.containerEl.firstChild);
			}
			const props = {
				collection: this.collection,
				today: DateTime.local(),
			};
			if (this.renderType == RenderType.Calendar) {
				new Calendar({
					target: this.containerEl,
					props: props,
				});
			} else {
				new Agenda({
					target: this.containerEl,
					props: props,
				});
			}
		});
	}
}
