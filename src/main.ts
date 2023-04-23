import { Plugin } from "obsidian";
import type { CalendarSettings } from "./settings";
import { CalendarSettingTab } from "./settings";
import { CalendarRenderChild, RenderType } from "./render";
import { QueryRunner } from "./parse";

const DEFAULT_SETTINGS: Partial<CalendarSettings> = {
	removeRegex: [],
};

export default class EventCalendar extends Plugin {
	settings: CalendarSettings;
	queryRunner: QueryRunner;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new CalendarSettingTab(this.app, this));
		this.queryRunner = this.addChild(new QueryRunner(this.settings));

		const calendar = this.registerMarkdownCodeBlockProcessor(
			"calendar",
			async (source, el, ctx) => {
				ctx.addChild(
					new CalendarRenderChild(
						app,
						el,
						source,
						RenderType.Calendar,
						this.queryRunner
					)
				);
			}
		);
		calendar.sortOrder = -100;

		const agenda = this.registerMarkdownCodeBlockProcessor(
			"agenda",
			async (source, el, ctx) => {
				ctx.addChild(
					new CalendarRenderChild(
						app,
						el,
						source,
						RenderType.Agenda,
						this.queryRunner
					)
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
