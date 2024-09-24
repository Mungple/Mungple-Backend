package com.e106.mungplace.domain.exploration.impl;

import com.e106.mungplace.common.map.dto.Point;
import com.e106.mungplace.domain.exploration.entity.DogExploration;
import com.e106.mungplace.domain.exploration.entity.Exploration;
import com.e106.mungplace.domain.exploration.repository.DogExplorationRepository;
import com.e106.mungplace.domain.exploration.repository.ExplorationRepository;
import com.e106.mungplace.domain.user.entity.User;
import com.e106.mungplace.web.exception.ApplicationException;
import com.e106.mungplace.web.exception.dto.ApplicationError;
import com.e106.mungplace.web.exploration.dto.ExplorationEventRequest;
import com.e106.mungplace.web.exploration.dto.ExplorationPayload;
import com.e106.mungplace.web.exploration.dto.ExplorationResponse;
import com.e106.mungplace.web.exploration.dto.ExplorationStartWithDogsRequest;
import com.e106.mungplace.web.util.DateRange;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@RequiredArgsConstructor
@Component
public class ExplorationHelper {

    private final ExplorationRepository explorationRepository;
    private final DogExplorationRepository dogExplorationRepository;

    public void createDogsInExploration(ExplorationStartWithDogsRequest dogs, Exploration exploration) {
        dogs.getDogs().stream()
                .map(dog -> DogExploration
                        .builder()
                        .exploration(exploration)
                        .dog(dog)
                        .isEnded(false)
                        .build())
                .forEach(dogExplorationRepository::save);
    }

    public ExplorationPayload createExplorationEventPayload(ExplorationEventRequest request) {
        Point point = getPoint(request.getLatitude(), request.getLongitude());
        return ExplorationPayload.of(point, request.getRecordedAt());
    }

    public void updateExplorationIsEnded(Exploration exploration) {
        Long distance = 0L; // TODO <fosong98> Redis에서 사용자 이동 거리 조회
        exploration.end(distance);
        dogExplorationRepository.findDogExplorationsByExplorationId(exploration.getId()).stream()
                .peek(dogExploration -> dogExploration.updateIsEnded(true))
                .forEach(dogExplorationRepository::save);
    }

    public List<ExplorationResponse> getExplorationInfos(Long userId, LocalDate date) {
        DateRange dateRange = DateRange.of(date);
        List<Exploration> explorations = explorationRepository.findByUserIdAndStartAtBetween(userId, dateRange.getStartDate(), dateRange.getEndDate());

        return explorations.stream()
                .map(exploration -> {
                    List<Long> togetherDogIds = getTogetherDogIds(exploration);
                    return ExplorationResponse.of(exploration, togetherDogIds);
                })
                .toList();
    }

    public List<Long> getTogetherDogIds(Exploration exploration) {
        return exploration.getDogExplorations().stream()
                .map(dogExploration -> dogExploration.getDog().getId())
                .toList();
    }

    public boolean validateIsUsersExploration(Exploration exploration, Long userId) {
        if (!Objects.equals(exploration.getUser().getUserId(), userId)) {
            throw new ApplicationException(ApplicationError.EXPLORATION_NOT_OWNED);
        }

        return true;
    }

    public boolean validateExplorationWithDogs(ExplorationStartWithDogsRequest dogs) {
        if(dogs.getDogs().isEmpty())
            throw new ApplicationException(ApplicationError.EXPLORATION_NOT_WITH_DOGS);

        return true;
    }

    public boolean validateIsEndedExploration(Long userId) {
        if (explorationRepository.existsByUserAndEndAtIsNull(new User(userId)))
            throw new ApplicationException(ApplicationError.ALREADY_ON_EXPLORATION);
        return true;
    }

    private Point getPoint(String latitude, String longitude) {
        return new Point(Double.parseDouble(latitude), Double.parseDouble(longitude));
    }
}
