package com.e106.mungplace.web.marker.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

import org.locationtech.spatial4j.io.GeohashUtils;
import org.springframework.data.elasticsearch.core.geo.GeoPoint;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.e106.mungplace.common.map.dto.Point;
import com.e106.mungplace.common.transaction.GlobalTransactional;
import com.e106.mungplace.domain.exploration.entity.Exploration;
import com.e106.mungplace.domain.exploration.impl.ExplorationReader;
import com.e106.mungplace.domain.image.entity.ImageInfo;
import com.e106.mungplace.domain.marker.entity.Marker;
import com.e106.mungplace.domain.marker.entity.MarkerEvent;
import com.e106.mungplace.domain.marker.entity.MarkerPoint;
import com.e106.mungplace.domain.marker.entity.OperationType;
import com.e106.mungplace.domain.marker.entity.PublishStatus;
import com.e106.mungplace.domain.marker.impl.MarkerReader;
import com.e106.mungplace.domain.marker.impl.MarkerSerializer;
import com.e106.mungplace.domain.marker.impl.MarkerWriter;
import com.e106.mungplace.domain.marker.repository.MarkerPointRepository;
import com.e106.mungplace.domain.user.impl.UserHelper;
import com.e106.mungplace.domain.util.GeoUtils;
import com.e106.mungplace.web.exception.ApplicationException;
import com.e106.mungplace.web.exception.dto.ApplicationError;
import com.e106.mungplace.web.marker.dto.CreateMarkerResponse;
import com.e106.mungplace.web.marker.dto.GeohashMarkerInfo;
import com.e106.mungplace.web.marker.dto.GeohashMarkerResponse;
import com.e106.mungplace.web.marker.dto.MarkerCreateRequest;
import com.e106.mungplace.web.marker.dto.MarkerInfoResponse;
import com.e106.mungplace.web.marker.dto.MarkerPayload;
import com.e106.mungplace.web.marker.dto.MarkerPointResponse;
import com.e106.mungplace.web.marker.dto.MarkerResponse;
import com.e106.mungplace.web.marker.dto.MarkerSearchRequest;
import com.e106.mungplace.web.marker.dto.RequestMarkerType;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class MarkerService {

	private static final int MARKER_PRECISION = 9;
	private static final int MAX_IMAGE_FILE_COUNT = 3;
	private static final int MARKER_SEARCH_DAY_RANGE = 1;
	private static final Double DEFAULT_MARKER_RADIUS = 500.0;
	private static final String ENTITY_TYPE_MARKER = "Marker";
	private static final String DATE_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";

	private final ExplorationReader explorationReader;
	private final MarkerWriter markerWriter;
	private final MarkerReader markerReader;
	private final UserHelper userHelper;
	private final MarkerSerializer markerSerializer;
	private final ObjectMapper objectMapper;
	private final MarkerPointRepository markerPointRepository;

	@GlobalTransactional
	@Transactional
	public CreateMarkerResponse createMarkerProcess(String markerInfoJson, List<MultipartFile> imageFiles) {
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
			.type(marker.getType())
			.explorationId(marker.getExploration() != null ? marker.getExploration().getId() : null)
			.build();

		// MarkerPayload를 JSON으로 직렬화
		String payload = markerSerializer.serializeMarker(markerPayload).orElseThrow(RuntimeException::new);

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

		return new CreateMarkerResponse(marker.getId());
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

	private Marker getMarkerOrThrow(UUID markerId) {
		return markerReader.find(markerId).orElseThrow(
			() -> new ApplicationException(ApplicationError.MARKER_NOT_FOUND));
	}

	@GlobalTransactional
	public void deleteMarkerProcess(UUID markerId) {
		Long userId = userHelper.getCurrentUserId();
		Marker marker = getMarkerOrThrow(markerId);
		validateIsUsersMarker(marker, userId);

		markerWriter.delete(marker);

		markerPointRepository.deleteById(markerId);
		markerWriter.delete(marker);
	}

	public GeohashMarkerResponse getMarkersGroupedByGeohash(MarkerSearchRequest markerSearchRequest) {
		List<MarkerPoint> markerPoints = findMarkersWithinRadius(markerSearchRequest);

		// Geohash로 그룹화
		Map<String, GeohashMarkerInfo> groupedMarkers = groupMarkersByGeohash(markerPoints);

		return GeohashMarkerResponse.builder()
			.markersGroupedByGeohash(groupedMarkers)
			.build();
	}

	private List<MarkerPoint> findMarkersWithinRadius(MarkerSearchRequest markerSearchRequest) {
		double latitude = markerSearchRequest.getLatitude();
		double longitude = markerSearchRequest.getLongitude();
		RequestMarkerType markerType = markerSearchRequest.getMarkerType();

		// 거리 계산
		String distance = DEFAULT_MARKER_RADIUS + "m";
		String[] timeRange = getTimeRange();

		// 타입에 따라 MarkerReader 호출
		if (markerType == RequestMarkerType.ALL) {
			return markerReader.findMarkersByGeoDistanceAndCreatedAtRange(distance, latitude, longitude, timeRange[0],
				timeRange[1]);
		}

		return markerReader.findMarkersByGeoDistanceAndCreatedAtRangeAndType(
			distance, latitude, longitude, timeRange[0], timeRange[1], markerType.getMarkerType().toLowerCase());
	}

	private String[] getTimeRange() {
		LocalDateTime now = LocalDateTime.now();
		LocalDateTime fromTime = now.minusDays(MARKER_SEARCH_DAY_RANGE);
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DATE_TIME_FORMAT);
		return new String[] {fromTime.format(formatter), now.format(formatter)};
	}

	// 마커 목록을 Geohash로 그룹화하는 메서드
	private Map<String, GeohashMarkerInfo> groupMarkersByGeohash(List<MarkerPoint> markerPoints) {
		return markerPoints.stream()
			.collect(Collectors.groupingBy(marker -> encodeGeoPoint(marker.getPoint(), MARKER_PRECISION),
				Collectors.collectingAndThen(
					Collectors.toList(),
					markerList -> {
						GeoPoint geoHashCenter = calculateGeohashCenterPoint(markerList);
						List<MarkerPointResponse> markerResponses = convertToMarkerResponses(markerList);
						return new GeohashMarkerInfo(geoHashCenter, markerResponses.size(), markerResponses);
					}
				)
			));
	}

	private String encodeGeoPoint(GeoPoint geoPoint, int precision) {
		return GeohashUtils.encodeLatLon(geoPoint.getLat(), geoPoint.getLon(), precision);
	}

	private GeoPoint calculateGeohashCenterPoint(List<MarkerPoint> markerList) {
		String geoHashString = encodeGeoPoint(markerList.get(0).getPoint(), MARKER_PRECISION);
		return GeoUtils.calculateGeohashCenterPoint(geoHashString).toGeoPoint();
	}

	private List<MarkerPointResponse> convertToMarkerResponses(List<MarkerPoint> markerList) {
		return markerList.stream()
			.map(this::convertToResponse)
			.collect(Collectors.toList());
	}

	private MarkerPointResponse convertToResponse(MarkerPoint markerPoint) {
		return MarkerPointResponse.builder()
			.markerId(markerPoint.getMarkerId())
			.userId(markerPoint.getUserId())
			.createdAt(markerPoint.getCreatedAt())
			.type(markerPoint.getType().name())
			.build();
	}

	public MarkerInfoResponse getMarkerInfo(UUID markerId) {
		Marker marker = getMarkerOrThrow(markerId);
		List<ImageInfo> imageInfos = markerReader.findMarkerImage(markerId);

		List<String> imageNames = imageInfos.stream()
			.map(ImageInfo::getImageName)
			.toList();

		return MarkerInfoResponse.builder()
			.id(marker.getId())
			.point(new Point(marker.getLon(), marker.getLat()))
			.title(marker.getTitle())
			.content(marker.getContent())
			.type(marker.getType().name())
			.userId(marker.getUser().getUserId())
			.images(imageNames)
			.createdAt(marker.getCreatedDate())
			.build();
	}

	public List<MarkerResponse> getUserMarkers(Long size, UUID cursorId) {
		Long userId = userHelper.getCurrentUserId();

		List<Marker> markers = (cursorId == null) ?
			markerReader.findFirstMarkersByUserId(userId, size) :
			markerReader.find(cursorId)
				.map(cursorMarker -> markerReader.findMarkersByUserIdAndCursor(userId, size,
					cursorMarker.getCreatedDate()))
				.orElseThrow(RuntimeException::new);

		return markers.stream()
			.map(MarkerResponse::of)
			.collect(Collectors.toList());
	}
}