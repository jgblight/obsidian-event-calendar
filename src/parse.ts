
import type DateTime from "luxon";
import type { TableResult } from "obsidian-dataview/lib/api/plugin-api";


export type DateItem = {
    date: DateTime,
    text: string,
    path: string,
    color: string,
}

export function parse_query_result(query: TableResult, color: string) : DateItem[] {
    const headers = query.headers;
    if (!headers.contains("date")) {
        throw new Error("Query must contain a 'date' column");
    }
    if (!headers.contains("text")) {
        throw new Error("Query must contain a 'text' column");
    }
    return query.values.map((item_list) => {
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
}