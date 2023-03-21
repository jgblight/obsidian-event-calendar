import { Notice, Plugin } from 'obsidian';
import { render_agenda } from 'src/render';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Potato', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a potato!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		this.registerMarkdownCodeBlockProcessor("calendar", (source, el, ctx) => {

			const dv = this.app.plugins.plugins.dataview?.api;

			dv?.tryQuery(source).then((query_result) => {
				const agenda = render_agenda(el, query_result);
			});
		});
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
