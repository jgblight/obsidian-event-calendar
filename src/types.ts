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

export class QueryRunner {
	constructor(
		private dataview: DataviewApi,
		private settings: CalendarSettings,
		private queryStr: string
	) {}

	async runQuery(): Promise<DateItem[]> {
		return this.dataview
			.tryQuery(this.queryStr)
			.then((query_result: QueryResult) => {
				return parse_query_result(
					query_result,
					this.settings.removeRegex
				);
			});
	}
}

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
	private cacheIsLoaded: boolean;
	private mutex: Mutex;

	constructor(public queryRunner: QueryRunner, public color: string) {
		this.dateMap = new Map();
		this.cacheIsLoaded = false;
		this.mutex = new Mutex();
	}

	private async updateCache() {
		if (!this.cacheIsLoaded) {
			await this.queryRunner.runQuery().then((items) => {
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
			this.cacheIsLoaded = true;
		}
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
		return this.mutex.runExclusive(this.updateCache.bind(this)).then(() => {
			const formatted = day.toFormat("DDD");
			return this.dateMap.get(formatted) ?? [];
		});
	}
}

export class DataSourceCollection {
	constructor(public sources: DataSource[], private app: App) {}

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
