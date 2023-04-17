import { DataSource } from "./types";
import type { QueryResult } from "obsidian-dataview/lib/api/plugin-api";

const red = "#e67e80";
const orange = "#e69875";
const yellow = "#dbbc7f";
const green = "#a7c080";
const aqua = "#83c092";
const blue = "#7fbbb3";
const purple = "#d699b6";

const colors = [blue, red, yellow, aqua, purple, orange, green];

export function parse(source : string) : Promise<DataSource>[] {
    const results : Promise<DataSource>[] = [];
    const queries = source.split('---');
    for (let i = 0; i < queries.length; i++) {
        const query = queries[i];
        const dv = this.app.plugins.plugins.dataview?.api;
        const data_source = dv?.tryQuery(query).then((query_result : QueryResult) => {return parse_query_result(query_result, colors[i])});
        results.push(data_source);
    }
    return results;
}

export function parse_query_result(query: QueryResult, color: string) : DataSource {
    if (query.type != "table") {
        throw new Error("Queries must be of type TABLE")
    }
    const headers = query.headers;
    if (!headers.contains("date")) {
        throw new Error("Query must contain a 'date' column");
    }
    if (!headers.contains("text")) {
        throw new Error("Query must contain a 'text' column");
    }
    const data = query.values.map((item_list) => {
        const file_object : any = item_list[0];
        const item_dict : { [key: string]: any } = {}
        for (let i = 0; i < item_list.length; i++) {
            item_dict[headers[i]] = item_list[i];
        }
        item_dict['file'] = file_object;
        return item_dict
    }).filter((item) => (item.date != undefined)).map((item) => ({
        "date": item.date,
        "text": item.text,
        "path": item.file.path, 
        "color": color
    }));
    return new DataSource(data, color);
}