import type { DateTime } from "luxon";
import { getDaysUntil } from "./date_utils";

export type DateItem = {
	date: DateTime;
	until?: DateTime;
	text: string;
	path: string;
};

export class DataSource {
	public color: string;
	public dateMap: Map<string, DateItem[]>;

	constructor(data: DateItem[], color: string) {
		this.color = color;
		this.dateMap = new Map();
		for (const item of data) {
			if (!!item.until) {
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
