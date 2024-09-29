package com.e106.mungplace.domain.exploration.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

import com.e106.mungplace.domain.exploration.entity.ExplorePoint;
import com.e106.mungplace.domain.exploration.repository.ExplorePointRepository;
import com.e106.mungplace.web.exploration.dto.*;

import org.springframework.stereotype.Component;

import com.e106.mungplace.common.map.dto.Point;
import com.e106.mungplace.domain.dogs.repository.DogRepository;
import com.e106.mungplace.domain.exploration.entity.DogExploration;
import com.e106.mungplace.domain.exploration.entity.Exploration;
import com.e106.mungplace.domain.exploration.repository.DogExplorationRepository;
import com.e106.mungplace.domain.exploration.repository.ExplorationRepository;
import com.e106.mungplace.domain.user.entity.User;
import com.e106.mungplace.web.exception.ApplicationException;
import com.e106.mungplace.web.exception.dto.ApplicationError;
import com.e106.mungplace.web.util.DateRange;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class ExplorationHelper {

	private final ExplorationRepository explorationRepository;
	private final ExplorePointRepository explorePointRepository;

	private final DogRepository dogRepository;
	private final DogExplorationRepository dogExplorationRepository;

	public void createDogsInExploration(ExplorationStartWithDogsRequest dogIds, Exploration exploration) {
		dogIds.dogIds().stream()
			.map(dogId -> dogRepository.findById(dogId)
				.map(dog -> DogExploration.builder()
					.exploration(exploration)
					.dog(dog)
					.isEnded(false)
					.build())
				.orElseThrow(() -> new ApplicationException(ApplicationError.DOG_NOT_FOUND)))
			.forEach(dogExplorationRepository::save);
	}

	public ExplorationPayload createExplorationEventPayload(ExplorationEventRequest request) {
		Point point = getPoint(request.getLat(), request.getLon());
		return ExplorationPayload.of(point, request.getRecordedAt());
	}

	public List<ExplorationResponse> getExplorationInfos(Long userId, LocalDate date, String type) {
		DateRange dateRange;
		dateRange = Objects.equals(type, "month") ? DateRange.ofMonth(date) : DateRange.ofDay(date);
		List<Exploration> explorations = explorationRepository.findByUserIdAndStartAtBetween(userId,
			dateRange.getStartDate(), dateRange.getEndDate());

		return explorations.stream()
			.map(exploration -> {
				List<Long> togetherDogIds = getTogetherDogIds(exploration);
				return ExplorationResponse.of(exploration, togetherDogIds);
			})
			.toList();
	}

	public List<ExplorationPoint> getExplorationPath(Long explorationId) {
		List<ExplorePoint> explorePoints = explorePointRepository.findByExplorationId(explorationId);
		return explorePoints.stream()
			.map(point -> ExplorationPoint.of(point.getPoint().getLat(), point.getPoint().getLon()))
			.toList();
	}

	public List<Long> getTogetherDogIds(Exploration exploration) {
		return exploration.getDogExplorations().stream()
			.map(dogExploration -> dogExploration.getDog().getId())
			.toList();
	}

	public boolean validateIsUsersExploration(Long userId, Exploration exploration) {
		if (!Objects.equals(exploration.getUser().getUserId(), userId)) {
			throw new ApplicationException(ApplicationError.EXPLORATION_NOT_OWNED);
		}
		return true;
	}

	public boolean validateExplorationWithDogs(ExplorationStartWithDogsRequest dogs) {
		if (dogs.dogIds().isEmpty())
			throw new ApplicationException(ApplicationError.EXPLORATION_NOT_WITH_DOGS);
		return true;
	}

	public boolean validateIsEndedExploration(Long userId) {
		if (explorationRepository.existsByUserAndEndAtIsNull(new User(userId)))
			throw new ApplicationException(ApplicationError.ALREADY_ON_EXPLORATION);
		return true;
	}

	private Point getPoint(String lat, String lon) {
		return new Point(Double.parseDouble(lat), Double.parseDouble(lon));
	}
}
