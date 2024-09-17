package com.e106.mungplace.web.exploration.service;

import java.time.LocalDateTime;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.e106.mungplace.domain.exploration.entity.Exploration;
import com.e106.mungplace.domain.exploration.impl.ExplorationReader;
import com.e106.mungplace.domain.user.entity.User;
import com.e106.mungplace.domain.user.impl.UserHelper;
import com.e106.mungplace.web.exception.ApplicationException;
import com.e106.mungplace.web.exception.dto.ApplicationError;
import com.e106.mungplace.web.exploration.dto.ExplorationStartResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class ExplorationService {

	private final UserHelper userHelper;
	private final ExplorationReader explorationReader;

	// TODO <fosong98> 클라이언트가 애견 정보를 선택해서 받는 방식으로 변경 필요
	@Transactional
	public ExplorationStartResponse startExplorationProcess() {
		Long userId = userHelper.getCurrentUserId();
		userHelper.validateUserHasDog(userId);
		validateIsNotExploring(userId);

		// TODO <fosong98> Redis에서 사용자 이동 거리 초기화 distance = 0
		Exploration exploration = explorationReader.create(new User(userId), LocalDateTime.now());

		return ExplorationStartResponse.of(exploration);
	}

	@Transactional
	public void endExplorationProcess(Long explorationId) {
		Long userId = userHelper.getCurrentUserId();
		Exploration exploration = explorationReader.get(explorationId);

		validateIsUsersExploration(exploration, userId);

		if (exploration.isEnded()) {
			log.debug("이미 종료된 산책 호출 id={}", explorationId);
			return;
		}

		// TODO <fosong98> Redis에서 사용자 이동 거리 조회
		Long distance = 0L;
		exploration.end(distance);
	}

	private static void validateIsUsersExploration(Exploration exploration, Long userId) {
		if (!Objects.equals(exploration.getUser().getUserId(), userId)) {
			throw new ApplicationException(ApplicationError.EXPLORATION_NOT_OWNED);
		}
	}

	private void validateIsNotExploring(Long userId) {
		if (explorationReader.isExploring(new User(userId)))
			throw new ApplicationException(ApplicationError.ALREADY_ON_EXPLORATION);
	}

}
