import type { DateTime } from "luxon";

export type DateItem = {
	date: DateTime;
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
			const day = item.date.toFormat("DDD");
			if (!this.dateMap.has(day)) {
				this.dateMap.set(day, [item]);
			} else {
				this.dateMap.get(day)?.push(item);
			}
		}
	}

	get_day(day: DateTime): DateItem[] {
		const formatted = day.toFormat("DDD");
		return this.dateMap.get(formatted) ?? [];
	}
}
