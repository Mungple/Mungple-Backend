package com.e106.mungplace.web.marker.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.e106.mungplace.common.config.minio.impl.ImageStore;
import com.e106.mungplace.common.transaction.GlobalTransactional;
import com.e106.mungplace.domain.exploration.entity.Exploration;
import com.e106.mungplace.domain.exploration.repository.ExplorationRepository;
import com.e106.mungplace.domain.image.entity.ImageInfo;
import com.e106.mungplace.domain.image.repository.ImageInfoRepository;
import com.e106.mungplace.domain.marker.entity.Marker;
import com.e106.mungplace.domain.marker.entity.MarkerEvent;
import com.e106.mungplace.domain.marker.entity.OperationType;
import com.e106.mungplace.domain.marker.entity.PublishStatus;
import com.e106.mungplace.domain.marker.repository.MarkerOutboxRepository;
import com.e106.mungplace.domain.marker.repository.MarkerRepository;
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

	private final MarkerRepository markerRepository;
	private final ExplorationRepository explorationRepository;
	private final ImageInfoRepository imageInfoRepository;
	private final MarkerOutboxRepository markerOutboxRepository;
	private final UserHelper userHelper;
	private final ImageStore imageStore;
	private final ObjectMapper objectMapper;

	@GlobalTransactional
	@Transactional
	public void createMarkerProcess(String markerInfoJson, List<MultipartFile> imageFiles) {
		// 이미지 파일 개수 검증
		validateImageFileCount(imageFiles);

		// Marker 정보 파싱
		MarkerCreateRequest markerInfo = parseMarkerInfo(markerInfoJson);

		// Marker 생성 및 저장
		Marker marker = createMarker(markerInfo);

		marker.updateUser(userHelper.getCurrentUser());
		markerRepository.save(marker);

		// 이미지 저장 처리
		saveImageFiles(imageFiles, marker);

		MarkerPayload markerPayload = MarkerPayload.builder()
			.markerId(marker.getId())
			.userId(marker.getUser().getUserId())
			.title(marker.getTitle())
			.lat(marker.getLat())
			.lon(marker.getLon())
			.type(marker.getType().name())
			.explorationId(marker.getExploration() != null ? marker.getExploration().getId() : null)
			.build();

		// Outbox 생성
		createMarkerEvent(marker, markerPayload);
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

	private void saveImageFiles(List<MultipartFile> imageFiles, Marker marker) {
		if (imageFiles != null && !imageFiles.isEmpty()) {
			for (MultipartFile file : imageFiles) {
				String imageName = imageStore.saveImage(file);
				imageInfoRepository.save(new ImageInfo(imageName, marker));
			}
		}
	}

	private void createMarkerEvent(Marker marker, MarkerPayload markerPayload) {
		// MarkerPayload를 JSON으로 직렬화
		String payload = serializeMarker(markerPayload).orElseThrow(RuntimeException::new);
		// MarkerEvent 객체 생성
		MarkerEvent outboxEntry = MarkerEvent.builder()
			.createdAt(LocalDateTime.now())
			.status(PublishStatus.READY)
			.payload(payload)
			.operationType(OperationType.CREATE)
			.entityType(ENTITY_TYPE_MARKER)
			.entityId(marker.getId())
			.build();

		// Outbox에 저장
		markerOutboxRepository.save(outboxEntry);
	}

	private Optional<String> serializeMarker(MarkerPayload markerPayload) {
		try {
			return Optional.of(objectMapper.writeValueAsString(markerPayload));
		} catch (JsonProcessingException e) {
			log.error("MarkerPayload 객체를 JSON으로 변환하는 중 오류 발생: {}", markerPayload.getMarkerId(), e);
			return Optional.empty();
		}
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