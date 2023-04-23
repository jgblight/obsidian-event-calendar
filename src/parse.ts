import { DataSource, DateItem } from "./types";
import type { QueryResult } from "obsidian-dataview/lib/api/plugin-api";
import { Component } from "obsidian";
import type { CalendarSettings } from "./settings";

const red = "#e67e80";
const orange = "#e69875";
const yellow = "#dbbc7f";
const green = "#a7c080";
const aqua = "#83c092";
const blue = "#7fbbb3";
const purple = "#d699b6";

const colors = [blue, red, yellow, aqua, purple, orange, green];

export class QueryRunner extends Component {
	constructor(private settings: CalendarSettings) {
		super();
	}

	async runQuery(sourceStr: string, callbackFn: (x: DataSource[]) => void) {
		return parse(sourceStr, this.settings.removeRegex).then((result) =>
			callbackFn(result)
		);
	}
}

export async function parse(
	source: string,
	removeRegex: string[]
): Promise<DataSource[]> {
	const results: Promise<DataSource>[] = [];
	const queries = source.split("---");
	for (let i = 0; i < queries.length; i++) {
		const query = queries[i];
		const dv = this.app.plugins.plugins.dataview?.api;
		const data_source = dv
			?.tryQuery(query)
			.then((query_result: QueryResult) => {
				return parse_query_result(query_result, colors[i], removeRegex);
			});
		results.push(data_source);
	}
	return Promise.all(results);
}

export function parse_query_result(
	query: QueryResult,
	color: string,
	removeRegex: string[]
): DataSource {
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
		.filter((item) => item.date != undefined)
		.map(
			(item) =>
				new DateItem(
					item.date,
					stripRegex(item.text, removeRegex),
					item.file,
					item.until
				)
		);
	return new DataSource(data, color);
}

function stripRegex(text: string, removeRegex: string[]): string {
	return removeRegex.reduce(
		(input, re) => input.replace(new RegExp(re), ""),
		text
	);
}
