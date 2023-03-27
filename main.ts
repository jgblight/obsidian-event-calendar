import { Notice, Plugin } from 'obsidian';
import { render_agenda } from 'src/render';
import { parse_query_result } from "src/parse"


/*
    --faded-red: #e67e80;
    --faded-orange: #e69875;
    --faded-yellow: #dbbc7f;
    --faded-green: #a7c080;
    --faded-aqua: #83c092;
    --faded-blue: #7fbbb3;
    --faded-purple: #d699b6;
*/

export default class EventCalendar extends Plugin {

	async onload() {

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
				render_agenda(el, parse_query_result(query_result, "#5a93a2"));
			});
		});
	}

	onunload() {

	}
}
