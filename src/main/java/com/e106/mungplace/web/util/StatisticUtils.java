package com.e106.mungplace.web.util;

import java.time.Duration;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.e106.mungplace.web.exploration.dto.ExplorationResponse;
import com.e106.mungplace.web.exploration.dto.ExplorationStatisticResponse;

@Component
public class StatisticUtils {

	public static ExplorationStatisticResponse createExplorationStatisticOfMonth(int year, int month,
		List<ExplorationResponse> explorations) {
		Map<LocalDate, Long> dailyDistances = new HashMap<>(generateDailyDistanceMap(explorations));
		Map<LocalDate, Long> dailyTimes = new HashMap<>(generateDailyTimeMap(explorations));
		LocalDate bestDistanceDay = findBestDistanceDay(dailyDistances);
		LocalDate bestTimeDay = findBestTimeDay(dailyTimes);

		Long totalTime = dailyTimes.values().stream().mapToLong(Long::longValue).sum();
		Long totalDistance = dailyDistances.values().stream().mapToLong(Long::longValue).sum();
		Long bestTime = dailyTimes.getOrDefault(bestTimeDay, 0L);
		Long bestDistance = dailyDistances.getOrDefault(bestDistanceDay, 0L);

		return ExplorationStatisticResponse.of(
			year,
			month,
			explorations.size(),
			totalTime,
			totalDistance,
			bestDistanceDay.getDayOfMonth(),
			bestDistance,
			bestTimeDay.getDayOfMonth(),
			bestTime
		);
	}

	private static LocalDate findBestTimeDay(Map<LocalDate, Long> dailyTimes) {
		return dailyTimes.entrySet().stream()
			.max(Map.Entry.comparingByValue())
			.map(Map.Entry::getKey)
			.orElse(LocalDate.MIN);
	}

	private static LocalDate findBestDistanceDay(Map<LocalDate, Long> dailyDistances) {
		return dailyDistances.entrySet().stream()
			.max(Map.Entry.comparingByValue())
			.map(Map.Entry::getKey)
			.orElse(LocalDate.MIN);
	}

	private static Map<LocalDate, Long> generateDailyTimeMap(List<ExplorationResponse> explorations) {
		return explorations.stream()
			.filter(exploration -> exploration.endTime() != null)
			.collect(Collectors.groupingBy(
					exploration -> exploration.startTime().toLocalDate(),
					Collectors.summingLong(
						exploration -> Duration.between(exploration.startTime(), exploration.endTime()).toSeconds())
				)
			);
	}

	private static Map<LocalDate, Long> generateDailyDistanceMap(List<ExplorationResponse> explorations) {
		return explorations.stream()
			.filter(exploration -> exploration.endTime() != null)
			.collect(Collectors.groupingBy(
				exploration -> exploration.startTime().toLocalDate(),
				Collectors.summingLong(ExplorationResponse::distance)
			));
	}
}
