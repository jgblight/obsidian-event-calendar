import type { DateTime } from "luxon";
import type { App } from "obsidian";
import type {
	DataviewApi,
} from "obsidian-dataview/lib/api/plugin-api";
import type { CalendarSettings } from "./settings";
import type { DataSource, DateItem } from "./query";
import { firstDayOfMonth } from "./date_utils";

export class CalendarState {
	private dateMap: Map<string, DateItem[]>;
	public lastLoad: number;

	constructor(
		public sources: DataSource[],
		private app: App,
		private dataview: DataviewApi,
		private settings: CalendarSettings,
		public year: number,
		public month: number,
	) {
		this.lastLoad = 0;
		this.dateMap = new Map();
	}

	public async updateCache(callback: () => void) {
		if (this.lastLoad != this.dataview.index.revision) {
			Promise.all(this.sources.map((s) => s.update(this.dataview, this.settings))).then(() => this.updateView()).then(callback);
			this.lastLoad = this.dataview.index.revision;
		}
	}

	public async prev_month() {
		this.month = this.month - 1;
		if (this.month == 0) {
			this.year = this.year - 1;
			this.month = 12;
		}
		this.updateView();
	}
  
	public async next_month() {
		this.month = this.month + 1;
		if (this.month == 13) {
			this.year = this.year + 1;
			this.month = 1;
		}
		this.updateView();
	}

	public async updateView() {
		this.dateMap = new Map();
		const firstDay = firstDayOfMonth(this.year, this.month);
		const nextMonth = this.month == 12 ? firstDayOfMonth(this.year + 1, 1) : firstDayOfMonth(this.year, this.month + 1);
		for (const source of this.sources) {
			for (const item of source.getItems(firstDay, nextMonth)) {
				const dayStr = this.get_key(item.date);
				if (!this.dateMap.has(dayStr)) {
					this.dateMap.set(dayStr, [item]);
				} else {
					this.dateMap.get(dayStr)?.push(item);
				}
			}
		}
	}

	async dayHasData(day: DateTime): Promise<boolean> {
		return this.dateMap.has(this.get_key(day));
	}

	async getDay(day: DateTime): Promise<DateItem[]> {
		return this.dateMap.get(this.get_key(day)) ?? [];
	}

	hoverItem(item: DateItem, element: HTMLElement) {
		this.app.workspace.trigger(
			"link-hover",
			{},
			element,
			item.link.path,
			item.link.path
		);
	}

	clickItem(item: DateItem) {
		const file = app.metadataCache.getFirstLinkpathDest(item.link.path, "");
		if (file == null) {
			return;
		}
		const leaf = app.workspace.getLeaf(true);
		leaf.openFile(file, { active: true });
	}

	private get_key(date: DateTime) : string {
		return date.toFormat("DDD");
	}
}

export type DateElement = {
	date: DateTime;
	element: HTMLElement;
};
