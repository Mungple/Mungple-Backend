package com.e106.mungplace.web.exploration.service;

import static com.e106.mungplace.web.exception.dto.ApplicationError.*;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.e106.mungplace.domain.exploration.entity.Exploration;
import com.e106.mungplace.domain.exploration.entity.ExplorationEvent;
import com.e106.mungplace.domain.exploration.impl.ExplorationHelper;
import com.e106.mungplace.domain.exploration.impl.ExplorationReader;
import com.e106.mungplace.domain.exploration.impl.ExplorationRecorder;
import com.e106.mungplace.domain.user.entity.User;
import com.e106.mungplace.domain.user.impl.UserHelper;
import com.e106.mungplace.web.exception.ApplicationException;
import com.e106.mungplace.web.exploration.dto.ExplorationEventRequest;
import com.e106.mungplace.web.exploration.dto.ExplorationPayload;
import com.e106.mungplace.web.exploration.dto.ExplorationPoint;
import com.e106.mungplace.web.exploration.dto.ExplorationResponse;
import com.e106.mungplace.web.exploration.dto.ExplorationStartResponse;
import com.e106.mungplace.web.exploration.dto.ExplorationStartWithDogsRequest;
import com.e106.mungplace.web.exploration.dto.ExplorationStatisticResponse;
import com.e106.mungplace.web.exploration.dto.ExplorationsResponse;
import com.e106.mungplace.web.exploration.service.producer.ExplorationProducer;
import com.e106.mungplace.web.util.StatisticUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class ExplorationService {

	private final UserHelper userHelper;
	private final ExplorationReader explorationReader;
	private final ExplorationHelper explorationHelper;
	private final ExplorationRecorder explorationRecorder;
	private final ExplorationProducer producer;

	@Transactional
	public ExplorationStartResponse startExplorationProcess(ExplorationStartWithDogsRequest request) {
		Long userId = userHelper.getCurrentUserId();
		explorationHelper.validateIsEndedExploration(userId);

		Exploration exploration = explorationReader.create(new User(userId), LocalDateTime.now());
		explorationHelper.validateExplorationWithDogs(request);
		explorationHelper.createDogsInExploration(request, exploration);
		explorationRecorder.initRecord(exploration.getId().toString(), userId.toString(), request.lat(),
			request.lon());

		return ExplorationStartResponse.of(exploration);
	}

	@Transactional
	public void endExplorationProcess(Long explorationId) {
		Long userId = userHelper.getCurrentUserId();
		Exploration exploration = explorationReader.get(explorationId);
		explorationHelper.validateIsUsersExploration(userId, exploration);

		if (exploration.isEnded()) {
			log.info("ERROR CODE : {}, ERROR MESSAGE : {}", IS_ENDED_EXPLORATION.getErrorCode(),
				IS_ENDED_EXPLORATION.getMessage());
			throw new ApplicationException(IS_ENDED_EXPLORATION);
		}

		explorationRecorder.endRecord(userId.toString(), explorationId.toString());
	}

	@Transactional(readOnly = true)
	public ExplorationsResponse findExplorationsOfMonthProcess(int year, int month) {
		Long userId = userHelper.getCurrentUserId();
		List<ExplorationResponse> explorationInfos = explorationHelper.getExplorationInfos(userId,
			LocalDate.of(year, month, 1), "month");
		return ExplorationsResponse.of(year, month, explorationInfos);
	}

	@Transactional(readOnly = true)
	public ExplorationsResponse findExplorationsOfDayProcess(LocalDate date) {
		Long userId = userHelper.getCurrentUserId();
		List<ExplorationResponse> explorations = explorationHelper.getExplorationInfos(userId, date, "day");
		return ExplorationsResponse.of(date.getYear(), date.getMonthValue(), explorations);
	}

	@Transactional(readOnly = true)
	public ExplorationResponse findExplorationProcess(Long explorationId) {
		Long userId = userHelper.getCurrentUserId();
		explorationHelper.validateIsEndedExploration(userId);

		Exploration exploration = explorationReader.get(explorationId);
		List<Long> togetherDogIds = explorationHelper.getTogetherDogIds(exploration);
		List<ExplorationPoint> points = explorationHelper.getExplorationPath(explorationId);

		return ExplorationResponse.of(exploration, togetherDogIds, points);
	}

	@Transactional(readOnly = true)
	public ExplorationStatisticResponse findExplorationStatisticsProcess(int year, int month) {
		Long userId = userHelper.getCurrentUserId();
		List<ExplorationResponse> explorationInfos = explorationHelper.getExplorationInfos(userId,
			LocalDate.of(year, month, 1), "month");
		return StatisticUtils.createExplorationStatisticOfMonth(year, month, explorationInfos);
	}

	@Transactional
	public void createExplorationEventProcess(ExplorationEventRequest eventRequest, Long explorationId,
		Principal principal) {
		String userId = principal.getName();
		eventRequest.setUserId(Long.parseLong(userId));

		explorationReader.isValidExploration(explorationId);
		explorationRecorder.recordExploration(userId, eventRequest.getLat(), eventRequest.getLon());

		ExplorationPayload payload = explorationHelper.createExplorationEventPayload(eventRequest);
		ExplorationEvent event = ExplorationEvent.of(eventRequest, explorationId, payload);
		producer.sendExplorationEvent(event);
	}
}
