package com.e106.mungplace.web.exploration.service;

import java.time.LocalDateTime;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.e106.mungplace.domain.exploration.entity.Exploration;
import com.e106.mungplace.domain.exploration.repository.ExplorationRepository;
import com.e106.mungplace.domain.user.entity.User;
import com.e106.mungplace.domain.user.impl.UserHelper;
import com.e106.mungplace.web.exploration.dto.ExplorationStartResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class ExplorationService {

	private final ExplorationRepository explorationRepository;
	private final UserHelper userHelper;

	// TODO <fosong98> 클라이언트가 애견 정보를 선택해서 받는 방식으로 변경 필요
	@Transactional
	public ExplorationStartResponse startExplorationProcess() {
		Long userId = userHelper.getCurrentUserId();
		userHelper.validateUserHasDog(userId);
		validateIsNotExploring(userId);

		Exploration exploration = new Exploration(new User(userId), LocalDateTime.now());
		// TODO <fosong98> Redis에서 사용자 이동 거리 초기화 distance = 0
		explorationRepository.save(exploration);

		return ExplorationStartResponse.of(exploration);
	}

	@Transactional
	public void endExplorationProcess(Long explorationId) {
		Long userId = userHelper.getCurrentUserId();
		Exploration exploration = getExplorationOrThrow(explorationId);

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
			// TODO <fosong98> 예외 구체화 필요
			throw new RuntimeException("사용자의 산책이 아닙니다.");
		}
	}

	private void validateIsNotExploring(Long userId) {
		if (explorationRepository.existsByUserAndEndAtIsNull(new User(userId)))
			// TODO <fosong98> 예외 구체화 필요
			throw new RuntimeException("이미 산책 중입니다.");
	}

	private Exploration getExplorationOrThrow(Long explorationId) {
		return explorationRepository.findById(explorationId).orElseThrow(() -> new RuntimeException("산책이 존재하지 않습니다."));
	}
}
