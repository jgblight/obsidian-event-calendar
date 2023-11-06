import type { QueryResult } from "obsidian-dataview/lib/api/plugin-api";
import { DataSource, DateItem } from "./types";
import { DateTime } from "luxon";

const red = "#e67e80";
const orange = "#e69875";
const yellow = "#dbbc7f";
const green = "#a7c080";
const aqua = "#83c092";
const blue = "#7fbbb3";
const purple = "#d699b6";

const colors = [blue, red, yellow, aqua, purple, orange, green];

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
): DateItem[] {
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
			(item) =>
				new DateItem(
					item.date,
					stripRegex(item.text, removeRegex),
					item.file,
					item.until
				)
		);
	return data;
}

function stripRegex(text: string, removeRegex: string[]): string {
	return removeRegex.reduce(
		(input, re) => input.replace(new RegExp(re), ""),
		text
	);
}
