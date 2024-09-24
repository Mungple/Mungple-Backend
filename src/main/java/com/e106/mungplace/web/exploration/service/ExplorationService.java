package com.e106.mungplace.web.exploration.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.e106.mungplace.domain.exploration.entity.ExplorationEvent;
import com.e106.mungplace.domain.exploration.impl.ExplorationHelper;
import com.e106.mungplace.domain.exploration.impl.ExplorationRecorder;
import com.e106.mungplace.web.exploration.dto.*;
import com.e106.mungplace.web.exploration.service.producer.ExplorationProducer;
import com.e106.mungplace.web.util.StatisticUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.e106.mungplace.domain.exploration.entity.Exploration;
import com.e106.mungplace.domain.exploration.impl.ExplorationReader;
import com.e106.mungplace.domain.user.entity.User;
import com.e106.mungplace.domain.user.impl.UserHelper;

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
		userHelper.validateUserHasDog(userId);
		explorationHelper.validateIsEndedExploration(userId);

		Exploration exploration = explorationReader.create(new User(userId), LocalDateTime.now());
		explorationHelper.validateExplorationWithDogs(request);
		explorationHelper.createDogsInExploration(request, exploration);

		// TODO <fosong98> Redis에서 사용자 이동 거리 초기화 distance = 0
		explorationRecorder.saveUser(userId.toString());
		explorationRecorder.saveCurrentUserGeoHash(userId.toString(), request.getLatitude(), request.getLongitude()); //

		return ExplorationStartResponse.of(exploration);
	}

	@Transactional
	public void endExplorationProcess(Long explorationId) {
		Long userId = userHelper.getCurrentUserId();
		Exploration exploration = explorationReader.get(explorationId);

		if (exploration.isEnded()) return;

		explorationHelper.validateIsUsersExploration(exploration, userId);
		explorationHelper.updateExplorationIsEnded(exploration);
	}

	@Transactional(readOnly = true)
	public ExplorationsResponse findExplorationsOfMonthProcess(int year, int month) {
		Long userId = userHelper.getCurrentUserId();
		List<ExplorationResponse> explorationInfos = explorationHelper.getExplorationInfos(userId, LocalDate.of(year, month, 1));
		return ExplorationsResponse.of(year, month, explorationInfos);
	}

	@Transactional(readOnly = true)
	public ExplorationsResponse findExplorationsOfDayProcess(LocalDate date) {
		Long userId = userHelper.getCurrentUserId();
		List<ExplorationResponse> explorations = explorationHelper.getExplorationInfos(userId, date);
		return ExplorationsResponse.of(date.getYear(), date.getMonthValue(), explorations);
	}

	@Transactional(readOnly = true)
	public ExplorationResponse findExplorationProcess(Long explorationId) {
		Long userId = userHelper.getCurrentUserId();
		Exploration exploration = explorationReader.get(explorationId);
		List<Long> togetherDogIds = explorationHelper.getTogetherDogIds(exploration);
		explorationHelper.validateIsEndedExploration(userId);

		List<ExplorationPoint> points = new ArrayList<>(); // TODO : <이현수> elastic search 조회 매핑

		return ExplorationResponse.of(exploration, togetherDogIds, points);
	}

	@Transactional(readOnly = true)
	public ExplorationStatisticResponse findExplorationStatisticsProcess(int year, int month) {
		Long userId = userHelper.getCurrentUserId();
		List<ExplorationResponse> explorationInfos = explorationHelper.getExplorationInfos(userId, LocalDate.of(year, month, 1));
		return StatisticUtils.createExplorationStatisticOfMonth(year, month, explorationInfos);
	}

	@Transactional
	public void createExplorationEventProcess(ExplorationEventRequest eventRequest, Long explorationId) {
//		explorationReader.getDuringExploring(explorationId);
		explorationRecorder.saveCurrentUserGeoHash(eventRequest.getUserId().toString(), eventRequest.getLatitude(), eventRequest.getLongitude());

		ExplorationPayload payload = explorationHelper.createExplorationEventPayload(eventRequest);
		ExplorationEvent event = ExplorationEvent.of(eventRequest, explorationId, payload);
		producer.sendExplorationEvent(event);
	}
}
