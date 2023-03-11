
import { App } from "obsidian";
import { Calendar, ICalendarSource, IDayMetadata, IDot } from "obsidian-calendar-ui";
import moment from "moment";
import { QueryResult } from "obsidian-dataview/lib/api/plugin-api";


export function render_calendar(query: QueryResult, container: HTMLElement, app: App) {
    // TODO(jen): Define some intermediate Event type
    
    let dateMap = new Map<string, any[]>();
    for (let val of query.values) {
        let key = val.value.day.toFormat("yyyyLLdd");
        if (!dateMap.has(key)) {
            dateMap.set(key, [val]);
        } else {
            dateMap.get(key)?.push(val);
        }
    }

    const querySource: ICalendarSource = {
        getDailyMetadata: async (date: moment.Moment): Promise<IDayMetadata> => {
            return {
                dots: (dateMap.get(date.format("YYYYMMDD")) || []).map((val) => {
                    return {
                    color: "#ff0000",
                    className: "h1",
                    isFilled: true,
                    isActive: true,
                }}),
            };
        },
    };


    
    const sources: ICalendarSource[] = [querySource];


    let calendar = new Calendar({
        target: container,
        props: {
            showWeekNums: false,
            sources,                
            onHoverDay(date: moment.Moment, targetEl: EventTarget): void {
                const vals = dateMap.get(date.format("YYYYMMDD"));

                if (!vals || vals.length == 0) {
                    return;
                }
                let section = vals[0].value.section;
                let sectionlink = section.path + "#" + section.subpath

                app.workspace.trigger("link-hover", {}, targetEl, sectionlink, sectionlink);
            },
        },
    }
    );
    return calendar

};