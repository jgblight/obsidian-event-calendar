import type { DateTime } from "luxon";
import type { App } from "obsidian";
import type { Link } from "obsidian-dataview";
import { getDaysUntil } from "./date_utils";
import type {
	DataviewApi,
	QueryResult,
} from "obsidian-dataview/lib/api/plugin-api";
import type { CalendarSettings } from "./settings";
import { parse_query_result } from "./parse";

import { Mutex } from "async-mutex";

export class DateItem {
	constructor(
		public date: DateTime,
		public text: string,
		public link: Link,
		public until?: DateTime
	) {}

	displayText(): string {
		return this.link.display || this.link.fileName();
	}
}

export class DataSource {
	private dateMap: Map<string, DateItem[]>;

	constructor(public queryStr: string, public color: string) {
		this.dateMap = new Map();
	}

	async update(dataview: DataviewApi, settings: CalendarSettings) {
		console.log("updating query");
		await dataview
			.tryQuery(this.queryStr)
			.then((query_result: QueryResult) => {
				return parse_query_result(query_result, settings.removeRegex);
			})
			.then((items) => {
				this.dateMap = new Map();
				for (const item of items) {
					if (item.until) {
						getDaysUntil(item.date, item.until).forEach((d) =>
							this.push_item(d, item)
						);
					} else {
						this.push_item(item.date, item);
					}
				}
			});
	}

	private push_item(date: DateTime, item: DateItem) {
		const dayStr = date.toFormat("DDD");
		if (!this.dateMap.has(dayStr)) {
			this.dateMap.set(dayStr, [item]);
		} else {
			this.dateMap.get(dayStr)?.push(item);
		}
	}

	async get_day(day: DateTime): Promise<DateItem[]> {
		const formatted = day.toFormat("DDD");
		return this.dateMap.get(formatted) ?? [];
	}
}

export class DataSourceCollection {
	public lastLoad: number;
	private mutex: Mutex;

	constructor(
		public sources: DataSource[],
		private app: App,
		private dataview: DataviewApi,
		private settings: CalendarSettings
	) {
		this.lastLoad = 0;
		this.mutex = new Mutex();
	}

	private async _updateCache() {
		if (this.lastLoad != this.dataview.index.revision) {
			console.log("update cache");
			await Promise.all(
				this.sources.map((s) => {
					s.update(this.dataview, this.settings);
				})
			);
			this.lastLoad = this.dataview.index.revision;
		}
	}

	public async updateCache() {
		return this.mutex.runExclusive(this._updateCache.bind(this));
	}

	async dayHasData(day: DateTime): Promise<boolean> {
		// TODO: return first true
		return Promise.all(this.sources.map((s) => s.get_day(day))).then(
			(results) => results.some((items) => items.length > 0)
		);
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
}

export type DateElement = {
	date: DateTime;
	element: HTMLElement;
};
