package com.e106.mungplace.web.marker.service;

import java.util.Objects;

import org.springframework.stereotype.Service;

import com.e106.mungplace.domain.exploration.entity.Exploration;
import com.e106.mungplace.domain.exploration.repository.ExplorationRepository;
import com.e106.mungplace.domain.marker.entity.Marker;
import com.e106.mungplace.domain.marker.repository.MarkerRepository;
import com.e106.mungplace.domain.user.impl.UserHelper;
import com.e106.mungplace.web.exception.ApplicationException;
import com.e106.mungplace.web.exception.dto.ApplicationError;
import com.e106.mungplace.web.marker.dto.MarkerCreateRequest;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class MarkerService {

	private final MarkerRepository markerRepository;
	private final ExplorationRepository explorationRepository;
	private final UserHelper userHelper;

	@Transactional
	public void createMarkerProcess(MarkerCreateRequest markerInfo) {
		Marker marker = createMarker(markerInfo);
		markerRepository.save(marker);

		// TODO: <홍성우> MinIO 에 저장
		// TODO: <홍성우> ES 에 저장
		// TODO: <홍성우> Outbox에 등록
	}

	@Transactional
	public void deleteMarkerProcess(Long markerId) {
		Long userId = userHelper.getCurrentUserId();
		Marker marker = getMarkerOrThrow(markerId);
		validateIsUsersMarker(marker, userId);

		// TODO: <홍성우> MinIO에서 마커 삭제하는 로직 구현
		// TODO: <홍성우> Elasticsearch에서 마커 삭제하는 로직 구현
		markerRepository.delete(marker);
	}

	private Marker createMarker(MarkerCreateRequest markerInfo) {
		if (markerInfo.getExplorationId() == null) {
			return markerInfo.toEntity();
		}

		Exploration exploration = explorationRepository.findById(markerInfo.getExplorationId())
			.orElseThrow(() -> new ApplicationException(ApplicationError.EXPLORATION_NOT_FOUND));
		return markerInfo.toEntity(exploration);
	}

	private void validateIsUsersMarker(Marker marker, Long userId) {
		if (!Objects.equals(marker.getUser().getUserId(), userId)) {
			throw new ApplicationException(ApplicationError.EXPLORATION_NOT_OWNED);
		}
	}

	private Marker getMarkerOrThrow(Long markerId) {
		return markerRepository.findById(markerId).orElseThrow(
			() -> new ApplicationException(ApplicationError.MARKER_NOT_FOUND));
	}
}