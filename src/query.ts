import { DateTime, Interval } from "luxon";
import type { Link } from "obsidian-dataview";
import type { DataviewApi, QueryResult } from "obsidian-dataview/lib/api/plugin-api";
import { RRule } from "rrule";
import { getDaysInRange } from "./date_utils";
import type { CalendarSettings } from "./settings";

const red = "#e67e80";
const orange = "#e69875";
const yellow = "#dbbc7f";
const green = "#a7c080";
const aqua = "#83c092";
const blue = "#7fbbb3";
const purple = "#d699b6";

const colors = [blue, red, yellow, aqua, purple, orange, green];

export class DateItem {
	constructor(
		public date: DateTime,
		public text: string,
		public link: Link,
		public color: string,
	) {}

	displayText(): string {
		return this.link.display || this.link.fileName();
	}
}

class RepeatEvent {
	constructor( 
		public rrule: RRule
	) {}

	public *getInstances(start: DateTime, end: DateTime) : Generator<DateTime> {
		const dates = this.rrule.between(start.toJSDate(), end.toJSDate());
		for (const d of dates) {
			yield DateTime.fromJSDate(d);
		}
	}
}

class SingleEvent {
	constructor(
		public start: DateTime,
		public end?: DateTime,
	) {}

	public *getInstances(start: DateTime, end: DateTime) : Generator<DateTime> {
		const interval = Interval.fromDateTimes(start, end);
		if (this.end && interval.overlaps(Interval.fromDateTimes(this.start, this.end))) {
			for (const d of getDaysInRange(this.start, this.end)) { yield d; }
		} else if (interval.contains(this.start)) {
			yield this.start;
		}
	}
}

export class Event {
	constructor(
		public event: SingleEvent | RepeatEvent,
		public text: string,
		public link: Link,
	) {}

	public *getInstances(start: DateTime, end: DateTime, color: string): Generator<DateItem> {
		for (const d of this.event.getInstances(start, end)) {
			yield new DateItem(d, this.text, this.link, color);
		}
	}
}

export class DataSource {
	private items: Event[];

	constructor(public queryStr: string, public color: string) {
		this.items = [];
	}

	public async update(dataview: DataviewApi, settings: CalendarSettings) {
		return dataview
			.tryQuery(this.queryStr)
			.then((query_result: QueryResult) => {
				this.items = parse_query_result(query_result, settings.removeRegex);
			})
	}

	public *getItems(start: DateTime, end: DateTime): Generator<DateItem> {
		for (const item of this.items) {
			yield* item.getInstances(start, end, this.color);
		}
	}


}

export function parseDataSources(source: string): DataSource[] {
	const results: DataSource[] = [];
	const queries = source.split("---");
	for (let i = 0; i < queries.length; i++) {
		results.push(new DataSource(queries[i], colors[i]));
	}
	return results;
}

export function parse_query_result(
	query: QueryResult,
	removeRegex: string[]
): Event[] {
	if (query.type != "table") {
		throw new Error("Queries must be of type TABLE");
	}
	const headers = query.headers;
	if (!headers.contains("date")) {
		throw new Error("Query must contain a 'date' column");
	}
	if (!headers.contains("text")) {
		throw new Error("Query must contain a 'text' column");
	}
	const data = query.values
		.map((item_list) => {
			const file_link: any = item_list[0];
			const item_dict: { [key: string]: any } = {};
			for (let i = 0; i < item_list.length; i++) {
				item_dict[headers[i]] = item_list[i];
			}
			item_dict["file"] = file_link;
			return item_dict;
		})
		.filter((item) => DateTime.isDateTime(item.date))
		.map(
			(item) => {
				let event : SingleEvent | RepeatEvent = new SingleEvent(item.date, item.until);
				if ( item.repeat ) {
					const options = RRule.parseText(item.repeat);
					options.dtstart = item.date.toJSDate();

					event = new RepeatEvent(new RRule(options));
				}
				return new Event(
					event,
					stripRegex(item.text, removeRegex),
					item.file,
				)
			}	
		);
	return data;
}

function stripRegex(text: string, removeRegex: string[]): string {
	return removeRegex.reduce(
		(input, re) => input.replace(new RegExp(re), ""),
		text
	);
}
