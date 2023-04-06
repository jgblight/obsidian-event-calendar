import { Plugin } from 'obsidian';
import { render_calendar } from 'src/render';
import { parse } from "src/parse"


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

		this.registerMarkdownCodeBlockProcessor("calendar", (source, el, ctx) => {
			parse(source).then((data) => (render_calendar(el, data)));
		});
	}

	onunload() {

	}
}
