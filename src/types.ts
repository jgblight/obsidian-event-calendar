import type { DateTime } from "luxon";
import type { App } from "obsidian";
import type { Link } from "obsidian-dataview";
import { getDaysUntil } from "./date_utils";

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
	public color: string;
	public dateMap: Map<string, DateItem[]>;

	constructor(data: DateItem[], color: string) {
		this.color = color;
		this.dateMap = new Map();
		for (const item of data) {
			if (item.until) {
				getDaysUntil(item.date, item.until).forEach((d) =>
					this.push_item(d, item)
				);
			} else {
				this.push_item(item.date, item);
			}
		}
	}

	push_item(date: DateTime, item: DateItem) {
		const dayStr = date.toFormat("DDD");
		if (!this.dateMap.has(dayStr)) {
			this.dateMap.set(dayStr, [item]);
		} else {
			this.dateMap.get(dayStr)?.push(item);
		}
	}

	get_day(day: DateTime): DateItem[] {
		const formatted = day.toFormat("DDD");
		return this.dateMap.get(formatted) ?? [];
	}
}

export class DataSourceCollection {
	public sources: DataSource[];
	private app: App;

	constructor(sources: DataSource[], app: App) {
		this.sources = sources;
		this.app = app;
	}

	dayHasData(day: DateTime): boolean {
		return this.sources.some((s) => s.get_day(day).length >= 1);
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
