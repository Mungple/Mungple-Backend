package com.e106.mungplace.web.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;

import lombok.Getter;

@Getter
public class DateRange {
	private final LocalDateTime startDate;
	private final LocalDateTime endDate;

	public DateRange(LocalDateTime startDate, LocalDateTime endDate) {
		this.startDate = startDate;
		this.endDate = endDate;
	}

	public static DateRange ofMonth(LocalDate date) {
		YearMonth yearMonth = YearMonth.from(date);
		LocalDateTime startDate = yearMonth.atDay(1).atStartOfDay();
		LocalDateTime endDate = yearMonth.atEndOfMonth().atTime(LocalTime.MAX);
		return new DateRange(startDate, endDate);
	}

	public static DateRange ofDay(LocalDate date) {
		LocalDateTime startDate = date.atStartOfDay();
		LocalDateTime endDate = date.atTime(LocalTime.MAX);
		return new DateRange(startDate, endDate);
	}

}
