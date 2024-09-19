package com.e106.mungplace.domain.exploration.impl;

import com.e106.mungplace.domain.exploration.entity.DogExploration;
import com.e106.mungplace.domain.exploration.entity.Exploration;
import com.e106.mungplace.domain.exploration.repository.DogExplorationRepository;
import com.e106.mungplace.domain.exploration.repository.ExplorationRepository;
import com.e106.mungplace.domain.user.entity.User;
import com.e106.mungplace.web.exception.ApplicationException;
import com.e106.mungplace.web.exception.dto.ApplicationError;
import com.e106.mungplace.web.exploration.dto.ExplorationEventRequest;
import com.e106.mungplace.web.exploration.dto.ExplorationResponse;
import com.e106.mungplace.web.exploration.dto.ExplorationStartWithDogsRequest;
import com.e106.mungplace.web.util.DateRange;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RequiredArgsConstructor
@Component
public class ExplorationHelper {

    private final ObjectMapper objectMapper;
    private final ExplorationRepository explorationRepository;
    private final DogExplorationRepository dogExplorationRepository;

    public void createDogsInExploration(ExplorationStartWithDogsRequest dogs, Exploration exploration) {
        dogs.getDogs().stream()
                .map(dog -> DogExploration
                        .builder()
                        .exploration(exploration)
                        .dog(dog)
                        .build())
                .forEach(dogExplorationRepository::save);
    }

    public String createExplorationEventPayload(ExplorationEventRequest request) {
        Map<String, Object> payloadMap = new HashMap<>();
        payloadMap.put("latitude", request.getLatitude());
        payloadMap.put("longitude", request.getLongitude());
        payloadMap.put("timestamp", request.getTimestamp());

        try {
            return objectMapper.writeValueAsString(payloadMap);
        } catch (JsonProcessingException e) {
            throw new ApplicationException(ApplicationError.JSON_PROCESS_FAILED);
        }
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
                .map(dogExploration -> dogExploration.getDog().getDogId())
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
}
