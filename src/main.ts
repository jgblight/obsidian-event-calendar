import { Plugin } from "obsidian";
import type { CalendarSettings } from "./settings";
import { CalendarSettingTab } from "./settings";
import { CalendarRenderChild, RenderType } from "./render";
import { parseDataSources } from "./parse";
import { DataSourceCollection } from "./types";

const DEFAULT_SETTINGS: Partial<CalendarSettings> = {
	removeRegex: [],
};

export default class EventCalendar extends Plugin {
	settings: CalendarSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new CalendarSettingTab(this.app, this));

		const calendar = this.registerMarkdownCodeBlockProcessor(
			"calendar",
			async (source, el, ctx) => {
				const collection = new DataSourceCollection(
					parseDataSources(source, this.settings),
					app
				);
				ctx.addChild(
					new CalendarRenderChild(el, collection, RenderType.Calendar)
				);
			}
		);
		calendar.sortOrder = -100;

		const agenda = this.registerMarkdownCodeBlockProcessor(
			"agenda",
			async (source, el, ctx) => {
				const collection = new DataSourceCollection(
					parseDataSources(source, this.settings),
					app
				);
				ctx.addChild(
					new CalendarRenderChild(el, collection, RenderType.Agenda)
				);
			}
		);
		agenda.sortOrder = -100;
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
