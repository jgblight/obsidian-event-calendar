import { DataSource } from "./types";
import type { TableResult } from "obsidian-dataview/lib/api/plugin-api";



const colors = ["#e67e80", "#e69875", "#dbbc7f", "#a7c080", "#83c092", "#7fbbb3", "#d699b6"];

export async function parse(source : string) : Promise<DataSource[]> {
    const results : DataSource[] = [];
    const queries = source.split('---');
    for (let i = 0; i < queries.length; i++) {
        const query = queries[i];
        const dv = this.app.plugins.plugins.dataview?.api;
        const data_source = await dv?.tryQuery(query).then((query_result) => {return parse_query_result(query_result, colors[i])});
        results.push(data_source);
    }
    return results;
}

export function parse_query_result(query: TableResult, color: string) : DataSource {
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