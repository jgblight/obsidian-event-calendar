import type EventCalendar from "./main";
import { App, PluginSettingTab, Setting } from "obsidian";

export interface CalendarSettings {
	removeRegex: string[];
}

export class CalendarSettingTab extends PluginSettingTab {
	plugin: EventCalendar;

	constructor(app: App, plugin: EventCalendar) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Strip Display Text")
			.setDesc(
				createFragment(
					(doc) =>
						(doc.createDiv().innerHTML =
							"Strip text matching these expressions from displayed calendar items." +
							"</br>Enter each regex on a separate line")
				)
			)
			.addTextArea((text) =>
				text
					.setPlaceholder("#task")
					.setValue(this.plugin.settings.removeRegex.join("\n"))
					.onChange(async (value) => {
						this.plugin.settings.removeRegex = value.split("\n");
						await this.plugin.saveSettings();
					})
			);
	}
}
