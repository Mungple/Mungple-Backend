package com.e106.mungplace.domain.exploration.impl;

import java.time.LocalDateTime;

import org.springframework.stereotype.Component;

import com.e106.mungplace.domain.exploration.entity.Exploration;
import com.e106.mungplace.domain.exploration.repository.ExplorationRepository;
import com.e106.mungplace.domain.user.entity.User;
import com.e106.mungplace.web.exception.ApplicationException;
import com.e106.mungplace.web.exception.ApplicationSocketException;
import com.e106.mungplace.web.exception.dto.ApplicationError;
import com.e106.mungplace.web.exception.dto.ApplicationSocketError;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class ExplorationReader {

	private final ExplorationRepository explorationRepository;

	public Exploration create(User user, LocalDateTime localDateTime) {
		return explorationRepository.save(new Exploration(user, localDateTime));
	}

	public Exploration get(Long explorationId) {
		return explorationRepository.findById(explorationId)
			.orElseThrow(() -> new ApplicationException(ApplicationError.EXPLORATION_NOT_FOUND));
	}

	public Exploration getDuringExploring(Long explorationId) {
		return explorationRepository.findById(explorationId).map(result -> {
			if (result.isEnded())
				throw new ApplicationSocketException(ApplicationSocketError.IS_ENDED_EXPLORATION);
			return result;
		}).orElseThrow(() -> new ApplicationSocketException(ApplicationSocketError.EXPLORATION_NOT_FOUND));
	}
}
