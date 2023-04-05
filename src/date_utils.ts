import { DateTime } from "luxon";

export function get_day_for_calendar_index(year: number, month: number, index: number) : DateTime|null {
    const firstDayOfMonth = DateTime.local(year, month, 1);
    const offset = firstDayOfMonth.weekday - 1; // -1 because luxon 1-indexes
    const dayOfMonth = index - offset;
    if (dayOfMonth < 1 || dayOfMonth > firstDayOfMonth.daysInMonth) {
        return null;
    } else {
        return DateTime.local(year, month, dayOfMonth);
    }
}