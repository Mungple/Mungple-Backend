package com.e106.mungplace.web.marker.service;

import static org.assertj.core.api.AssertionsForInterfaceTypes.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.assertj.core.api.Assertions;
import org.assertj.core.api.ThrowableAssert;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.elasticsearch.core.geo.GeoPoint;
import org.springframework.web.multipart.MultipartFile;

import com.e106.mungplace.common.image.ImageManager;
import com.e106.mungplace.domain.exploration.entity.Exploration;
import com.e106.mungplace.domain.exploration.impl.ExplorationReader;
import com.e106.mungplace.domain.image.repository.MarkerImageRepository;
import com.e106.mungplace.domain.marker.entity.Marker;
import com.e106.mungplace.domain.marker.entity.MarkerEvent;
import com.e106.mungplace.domain.marker.entity.MarkerPoint;
import com.e106.mungplace.domain.marker.entity.MarkerType;
import com.e106.mungplace.domain.marker.impl.MarkerReader;
import com.e106.mungplace.domain.marker.impl.MarkerSerializer;
import com.e106.mungplace.domain.marker.impl.MarkerWriter;
import com.e106.mungplace.domain.user.entity.ProviderName;
import com.e106.mungplace.domain.user.entity.User;
import com.e106.mungplace.domain.user.impl.UserHelper;
import com.e106.mungplace.web.exception.ApplicationException;
import com.e106.mungplace.web.marker.dto.GeohashMarkerResponse;
import com.e106.mungplace.web.marker.dto.MarkerCreateRequest;
import com.e106.mungplace.web.marker.dto.MarkerPayload;
import com.e106.mungplace.web.marker.dto.MarkerSearchRequest;
import com.e106.mungplace.web.marker.dto.RequestMarkerType;
import com.fasterxml.jackson.databind.ObjectMapper;

@ExtendWith(MockitoExtension.class)
class MarkerServiceTest {

	@Mock
	private ExplorationReader explorationReader;

	@Mock
	private MarkerWriter markerWriter;

	@Mock
	private MarkerReader markerReader;

	@Mock
	private UserHelper userHelper;

	@Mock
	private MarkerSerializer markerSerializer;

	@Spy
	private final ObjectMapper objectMapper = new ObjectMapper();

	@InjectMocks
	private MarkerService markerService;

	@Mock
	private ImageManager imageManager;

	@Mock
	private MarkerImageRepository markerImageRepository;

	@DisplayName("이미지가 4개 이상이면 에러")
	@Test
	void testCreateMarkerProcess_WhenImageCountExceeds_ThrowsException() throws Exception {
		// given
		String markerInfoJson =
			"{" + "\"title\": \"markerTitle\"," + "\"content\": \"markerContent\"," + "\"markerType\": \"BLUE\","
				+ "\"lat\": 36.9369," + "\"lon\": 22.2222" + "}";

		List<MultipartFile> imageFiles = Arrays.asList(mock(MultipartFile.class), mock(MultipartFile.class),
			mock(MultipartFile.class), mock(MultipartFile.class));

		// when
		ThrowableAssert.ThrowingCallable expectThrow = () -> markerService.createMarkerProcess(markerInfoJson,
			imageFiles);

		// then
		Assertions.assertThatThrownBy(expectThrow).isInstanceOf(ApplicationException.class);
	}

	@DisplayName("산책중이 아닐때 마커생성")
	@Test
	void testCreateMarkerProcess_Success() throws Exception {
		// given
		User user = User.builder()
			.providerId("provider123")
			.providerName(ProviderName.GOOGLE)
			.nickname("testNickname")
			.imageName("profileImage.png")
			.build();

		String markerInfoJson =
			"{" + "\"title\": \"markerTitle\"," + "\"content\": \"markerContent\"," + "\"markerType\": \"BLUE\","
				+ "\"lat\": 36.9369," + "\"lon\": 22.2222" + "}";

		// MarkerCreateRequest 객체를 생성하는 실제 파싱
		MarkerCreateRequest request = MarkerCreateRequest.builder()
			.title("markerTitle")
			.content("markerContent")
			.markerType(MarkerType.BLUE)
			.lat(36.9369)
			.lon(22.2222)
			.build();

		List<MultipartFile> imageFiles = Arrays.asList(mock(MultipartFile.class), mock(MultipartFile.class),
			mock(MultipartFile.class));

		// Marker 객체 생성
		Marker marker = Marker.builder()
			.lat(36.9369)
			.lon(22.2222)
			.title("markerTitle")
			.content("markerContent")
			.type(MarkerType.BLUE)
			.build();

		// MarkerPayload 객체 생성
		MarkerPayload markerPayload = MarkerPayload.builder()
			.markerId(marker.getId())
			.userId(user.getUserId())
			.title(marker.getTitle())
			.lat(marker.getLat())
			.lon(marker.getLon())
			.type(marker.getType())
			.explorationId(null)
			.build();

		// JSON 직렬화된 MarkerPayload
		String serializedPayload = new ObjectMapper().writeValueAsString(markerPayload);

		// when
		when(userHelper.getCurrentUser()).thenReturn(user);
		when(objectMapper.readValue(markerInfoJson, MarkerCreateRequest.class)).thenReturn(request);
		when(markerSerializer.serializeMarker(any(MarkerPayload.class))).thenReturn(Optional.of(serializedPayload));

		// then
		markerService.createMarkerProcess(markerInfoJson, imageFiles);

		verify(markerWriter).saveMarker(any(Marker.class));
		verify(markerWriter, times(1)).createMarkerEvent(any(MarkerEvent.class));
	}

	@DisplayName("마커 생성시 마커 저장(산책 할때)")
	@Test
	void testCreateMarkerProcess_WhenExploring_ThenSaveExploration() throws Exception {
		// given
		User user = new User(1L);
		Exploration exploration = new Exploration();

		List<MultipartFile> imageFiles = Arrays.asList(mock(MultipartFile.class), mock(MultipartFile.class));

		Marker marker = Marker.builder()
			.lat(36.9369)
			.lon(22.2222)
			.title("markerTitle")
			.content("markerContent")
			.exploration(exploration)
			.type(MarkerType.BLUE)
			.user(user)
			.build();

		String markerInfoJson =
			"{" + "\"title\": \"markerTitle\"," + "\"content\": \"markerContent\"," + "\"markerType\": \"BLUE\","
				+ "\"lat\": 36.9369," + "\"lon\": 22.2222" + "}";

		// MarkerPayload 객체 생성
		MarkerPayload markerPayload = MarkerPayload.builder()
			.markerId(marker.getId())
			.userId(user.getUserId())
			.title(marker.getTitle())
			.lat(marker.getLat())
			.lon(marker.getLon())
			.type(marker.getType())
			.explorationId(exploration.getId()) // 탐험 ID 설정
			.build();

		String serializedMarkerPayload = objectMapper.writeValueAsString(markerPayload);

		when(markerSerializer.serializeMarker(any(MarkerPayload.class))).thenReturn(
			Optional.of(serializedMarkerPayload));

		// when
		when(userHelper.getCurrentUser()).thenReturn(user);

		// then
		markerService.createMarkerProcess(markerInfoJson, imageFiles);

		verify(markerWriter, times(1)).saveMarker(any(Marker.class));
		verify(markerWriter, times(1)).createMarkerEvent(any(MarkerEvent.class));
	}

	@DisplayName("모든 타입의 마커 조회")
	@Test
	void testGetMarkersGroupedByGeohash_AllType() {
		// given
		MarkerSearchRequest request = MarkerSearchRequest.builder()
			.latitude(36.9369)
			.longitude(22.2222)
			.markerType(RequestMarkerType.ALL)
			.build();

		MarkerPoint markerPoint1 = MarkerPoint.builder()
			.userId(101L)
			.createdAt(LocalDateTime.now())
			.type(MarkerType.BLUE)
			.point(new GeoPoint(35.123456, 128.123456))
			.build();

		MarkerPoint markerPoint2 = MarkerPoint.builder()
			.userId(102L)
			.createdAt(LocalDateTime.now())
			.type(MarkerType.RED)
			.point(new GeoPoint(35.123457, 128.123457))
			.build();

		List<MarkerPoint> mockMarkerPoints = List.of(markerPoint1, markerPoint2);

		when(markerReader.findMarkersByGeoDistanceAndCreatedAtRange(anyString(), anyDouble(), anyDouble(), anyString(),
			anyString())).thenReturn(mockMarkerPoints);

		// when
		GeohashMarkerResponse response = markerService.getMarkersGroupedByGeohash(request);

		// then
		assertNotNull(response);
		assertThat(response.markersGroupedByGeohash()).isNotEmpty();
		verify(markerReader, times(1)).findMarkersByGeoDistanceAndCreatedAtRange(anyString(), anyDouble(), anyDouble(),
			anyString(), anyString());
	}

	@DisplayName("모든 RED타입의 마커 조회")
	@Test
	void testGetMarkersGroupedByGeohash_TypeFiltered() {
		// given
		MarkerSearchRequest request = MarkerSearchRequest.builder()
			.latitude(36.9369)
			.longitude(22.2222)
			.markerType(RequestMarkerType.RED)
			.build();

		MarkerPoint markerPoint = MarkerPoint.builder()
			.userId(101L)
			.createdAt(LocalDateTime.now())
			.type(MarkerType.RED)
			.point(new GeoPoint(35.123456, 128.123456))
			.build();

		List<MarkerPoint> mockMarkerPoints = List.of(markerPoint);
		when(markerReader.findMarkersByGeoDistanceAndCreatedAtRangeAndType(anyString(), anyDouble(), anyDouble(),
			anyString(), anyString(), anyString())).thenReturn(mockMarkerPoints);

		// when
		GeohashMarkerResponse response = markerService.getMarkersGroupedByGeohash(request);

		// then
		assertNotNull(response);
		assertThat(response.markersGroupedByGeohash()).isNotEmpty();
		verify(markerReader, times(1)).findMarkersByGeoDistanceAndCreatedAtRangeAndType(anyString(), anyDouble(),
			anyDouble(), anyString(), anyString(), anyString());
	}
}

