import { DateTime } from "luxon";
import { Plugin } from "obsidian";
import { parse } from "./parse";
import Agenda from "./components/Agenda.svelte";
import Calendar from "./components/Calendar.svelte";
import { CalendarSettingTab } from "./settings";
import { DataSourceCollection } from "./types";

interface CalendarSettings {
	removeRegex: string[];
}

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
				const sources = await parse(source, this.settings.removeRegex);
				return new Calendar({
					target: el,
					props: {
						collection: new DataSourceCollection(sources, this.app),
						today: DateTime.local(),
					},
				});
			}
		);
		calendar.sortOrder = -100;

		const agenda = this.registerMarkdownCodeBlockProcessor(
			"agenda",
			async (source, el, ctx) => {
				const sources = await parse(source, this.settings.removeRegex);
				return new Agenda({
					target: el,
					props: {
						collection: new DataSourceCollection(sources, this.app),
						today: DateTime.local(),
					},
				});
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
