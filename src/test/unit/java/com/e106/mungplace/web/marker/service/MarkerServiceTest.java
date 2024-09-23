package com.e106.mungplace.web.marker.service;

import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;

import org.assertj.core.api.Assertions;
import org.assertj.core.api.ThrowableAssert;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import com.e106.mungplace.common.image.ImageStore;
import com.e106.mungplace.domain.exploration.entity.Exploration;
import com.e106.mungplace.domain.exploration.impl.ExplorationReader;
import com.e106.mungplace.domain.image.repository.MarkerImageRepository;
import com.e106.mungplace.domain.marker.entity.Marker;
import com.e106.mungplace.domain.marker.entity.MarkerEvent;
import com.e106.mungplace.domain.marker.entity.MarkerType;
import com.e106.mungplace.domain.marker.impl.MarkerReader;
import com.e106.mungplace.domain.marker.impl.MarkerWriter;
import com.e106.mungplace.domain.user.entity.ProviderName;
import com.e106.mungplace.domain.user.entity.User;
import com.e106.mungplace.domain.user.impl.UserHelper;
import com.e106.mungplace.web.exception.ApplicationException;
import com.e106.mungplace.web.marker.dto.MarkerCreateRequest;
import com.e106.mungplace.web.marker.dto.MarkerPayload;
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

	@Spy
	private final ObjectMapper objectMapper = new ObjectMapper();

	@InjectMocks
	private MarkerService markerService;

	@Mock
	private ImageStore imageStore;

	@Mock
	private MarkerImageRepository markerImageRepository;

	@DisplayName("이미지가 4개 이상이면 에러")
	@Test
	void testCreateMarkerProcess_WhenImageCountExceeds_ThrowsException() throws Exception {
		// given
		String markerInfoJson = "{"
			+ "\"title\": \"markerTitle\","
			+ "\"content\": \"markerContent\","
			+ "\"markerType\": \"BLUE\","
			+ "\"lat\": 36.9369,"
			+ "\"lon\": 22.2222"
			+ "}";

		List<MultipartFile> imageFiles = Arrays.asList(
			mock(MultipartFile.class),
			mock(MultipartFile.class),
			mock(MultipartFile.class),
			mock(MultipartFile.class)
		);

		// when
		ThrowableAssert.ThrowingCallable expectThrow = () -> markerService.createMarkerProcess(markerInfoJson, imageFiles);

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

		String markerInfoJson = "{"
			+ "\"title\": \"markerTitle\","
			+ "\"content\": \"markerContent\","
			+ "\"markerType\": \"BLUE\","
			+ "\"lat\": 36.9369,"
			+ "\"lon\": 22.2222"
			+ "}";

		// MarkerCreateRequest 객체를 생성하는 실제 파싱
		MarkerCreateRequest request = MarkerCreateRequest.builder()
			.title("markerTitle")
			.content("markerContent")
			.markerType(MarkerType.BLUE)
			.lat(36.9369)
			.lon(22.2222)
			.build();

		List<MultipartFile> imageFiles = Arrays.asList(
			mock(MultipartFile.class),
			mock(MultipartFile.class),
			mock(MultipartFile.class)
		);

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
			.type(marker.getType().name())
			.explorationId(null)
			.build();

		// JSON 직렬화된 MarkerPayload
		String serializedPayload = new ObjectMapper().writeValueAsString(markerPayload);

		// when
		when(userHelper.getCurrentUser()).thenReturn(user);
		when(objectMapper.readValue(markerInfoJson, MarkerCreateRequest.class)).thenReturn(request);
		when(objectMapper.writeValueAsString(any(MarkerPayload.class))).thenReturn(serializedPayload);

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

		List<MultipartFile> imageFiles = Arrays.asList(
			mock(MultipartFile.class),
			mock(MultipartFile.class)
		);

		Marker marker = Marker.builder()
			.lat(36.9369)
			.lon(22.2222)
			.title("markerTitle")
			.content("markerContent")
			.exploration(exploration)
			.type(MarkerType.BLUE)
			.user(user)
			.build();

		String markerInfoJson = "{"
			+ "\"title\": \"markerTitle\","
			+ "\"content\": \"markerContent\","
			+ "\"markerType\": \"BLUE\","
			+ "\"lat\": 36.9369,"
			+ "\"lon\": 22.2222"
			+ "}";

		// MarkerPayload 객체 생성
		MarkerPayload markerPayload = MarkerPayload.builder()
			.markerId(marker.getId())
			.userId(user.getUserId())
			.title(marker.getTitle())
			.lat(marker.getLat())
			.lon(marker.getLon())
			.type(marker.getType().name())
			.explorationId(exploration.getId()) // 탐험 ID 설정
			.build();

		// when
		when(userHelper.getCurrentUser()).thenReturn(user);

		// then
		markerService.createMarkerProcess(markerInfoJson, imageFiles);

		verify(markerWriter, times(1)).saveMarker(any(Marker.class));
		verify(markerWriter, times(1)).createMarkerEvent(any(MarkerEvent.class));
	}
}

