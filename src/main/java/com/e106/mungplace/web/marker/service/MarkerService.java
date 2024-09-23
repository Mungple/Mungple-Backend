package com.e106.mungplace.web.marker.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.e106.mungplace.common.transaction.GlobalTransactional;
import com.e106.mungplace.domain.exploration.entity.Exploration;
import com.e106.mungplace.domain.exploration.impl.ExplorationReader;
import com.e106.mungplace.domain.marker.entity.Marker;
import com.e106.mungplace.domain.marker.entity.MarkerEvent;
import com.e106.mungplace.domain.marker.entity.OperationType;
import com.e106.mungplace.domain.marker.entity.PublishStatus;
import com.e106.mungplace.domain.marker.impl.MarkerReader;
import com.e106.mungplace.domain.marker.impl.MarkerWriter;
import com.e106.mungplace.domain.marker.repository.MarkerPointRepository;
import com.e106.mungplace.domain.user.impl.UserHelper;
import com.e106.mungplace.web.exception.ApplicationException;
import com.e106.mungplace.web.exception.dto.ApplicationError;
import com.e106.mungplace.web.marker.dto.MarkerCreateRequest;
import com.e106.mungplace.web.marker.dto.MarkerPayload;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class MarkerService {

	private static final int MAX_IMAGE_FILE_COUNT = 3;
	private static final String ENTITY_TYPE_MARKER = "Marker";

	private final ExplorationReader explorationReader;
	private final MarkerWriter markerWriter;
	private final MarkerReader markerReader;
	private final UserHelper userHelper;
	private final ObjectMapper objectMapper;
	private final MarkerPointRepository markerPointRepository;

	@GlobalTransactional
	@Transactional
	public void createMarkerProcess(String markerInfoJson, List<MultipartFile> imageFiles) {
		// 이미지 파일 개수 검증
		validateImageFileCount(imageFiles);

		MarkerCreateRequest markerInfo = parseMarkerInfo(markerInfoJson);

		Marker marker = createMarker(markerInfo);

		marker.updateUser(userHelper.getCurrentUser());
		markerWriter.saveMarker(marker);
		markerWriter.saveMarkerImages(imageFiles, marker);

		MarkerPayload markerPayload = MarkerPayload.builder()
			.markerId(marker.getId())
			.userId(marker.getUser().getUserId())
			.title(marker.getTitle())
			.lat(marker.getLat())
			.lon(marker.getLon())
			.type(marker.getType().name())
			.explorationId(marker.getExploration() != null ? marker.getExploration().getId() : null)
			.build();

		// MarkerPayload를 JSON으로 직렬화
		String payload = serializeMarker(markerPayload).orElseThrow(RuntimeException::new);

		MarkerEvent outboxEntry = MarkerEvent.builder()
			.createdAt(LocalDateTime.now())
			.status(PublishStatus.READY)
			.payload(payload)
			.operationType(OperationType.CREATE)
			.entityType(ENTITY_TYPE_MARKER)
			.entityId(marker.getId())
			.build();

		// Outbox 생성
		markerWriter.createMarkerEvent(outboxEntry);
	}

	private Optional<String> serializeMarker(MarkerPayload markerPayload) {
		try {
			return Optional.of(objectMapper.writeValueAsString(markerPayload));
		} catch (JsonProcessingException e) {
			log.error("MarkerPayload 객체를 JSON으로 변환하는 중 오류 발생: {}", markerPayload.getMarkerId(), e);
			return Optional.empty();
		}
	}
	private void validateImageFileCount(List<MultipartFile> imageFiles) {
		if (imageFiles != null && imageFiles.size() > MAX_IMAGE_FILE_COUNT) {
			throw new ApplicationException(ApplicationError.IMAGE_COUNT_EXCEEDS_LIMIT);
		}
	}

	private MarkerCreateRequest parseMarkerInfo(String markerInfoJson) {
		try {
			return objectMapper.readValue(markerInfoJson, MarkerCreateRequest.class);
		} catch (JsonProcessingException e) {
			throw new ApplicationException(ApplicationError.MARKER_REQUEST_NOT_VALID);
		}
	}

	private Marker createMarker(MarkerCreateRequest markerInfo) {
		if (markerInfo.getExplorationId() == null) {
			return markerInfo.toEntity();
		}
		Exploration exploration = explorationReader.get(markerInfo.getExplorationId());
		return markerInfo.toEntity(exploration);
	}

	private void validateIsUsersMarker(Marker marker, Long userId) {
		if (!Objects.equals(marker.getUser().getUserId(), userId)) {
			throw new ApplicationException(ApplicationError.EXPLORATION_NOT_OWNED);
		}
	}

	private Marker getMarkerOrThrow(Long markerId) {
		return markerReader.find(markerId).orElseThrow(
			() -> new ApplicationException(ApplicationError.MARKER_NOT_FOUND));
	}

	@Transactional
	public void deleteMarkerProcess(Long markerId) {
		Long userId = userHelper.getCurrentUserId();
		Marker marker = getMarkerOrThrow(markerId);
		validateIsUsersMarker(marker, userId);

		// TODO: <홍성우> MinIO에서 마커 삭제하는 로직 구현
		// TODO: <홍성우> Elasticsearch에서 마커 삭제하는 로직 구현
		markerWriter.delete(marker);
	}
}