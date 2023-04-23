import { DateTime, Duration } from "luxon";

type Week = {
	week_no: number;
	days: Map<string, DateTime>;
};
type MonthGrid = Week[];

export function getMonthGrid(year: number, month: number): MonthGrid {
	const firstDayOfMonth = DateTime.local(year, month, 1);
	const month_grid = [];
	let week = {
		week_no: firstDayOfMonth.weekNumber,
		days: new Map(),
	};
	const daysInMonth = firstDayOfMonth.daysInMonth;
	if (daysInMonth === undefined) {
		throw new Error("Invalid month");
	}
	for (let i = 1; i <= daysInMonth; i++) {
		const day = DateTime.local(year, month, i);
		if (day.weekday == 1 || month_grid.length == 0) {
			week = {
				week_no: day.weekNumber,
				days: new Map(),
			};
			month_grid.push(week);
		}
		week.days.set(day.weekdayShort, day);
	}
	return month_grid;
}

export function getNextNDays(startDate: DateTime, numDays: number): DateTime[] {
	const days = [];
	for (let i = 0; i < numDays; i++) {
		days.push(startDate.plus(Duration.fromObject({ days: i })));
	}
	return days;
}

export function getDaysUntil(
	startDate: DateTime,
	endDate: DateTime
): DateTime[] {
	const diff = endDate.diff(startDate).shiftTo("days");
	return getNextNDays(startDate, diff.days + 1);
}
