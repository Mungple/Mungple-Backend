package com.e106.mungplace.domain.exploration.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.e106.mungplace.common.map.dto.Point;
import com.e106.mungplace.domain.exploration.entity.Exploration;
import com.e106.mungplace.domain.exploration.repository.DogExplorationRepository;
import com.e106.mungplace.domain.exploration.repository.ExplorationRepository;
import com.e106.mungplace.web.exception.ApplicationSocketException;
import com.e106.mungplace.web.handler.interceptor.WebSocketSessionManager;
import com.fasterxml.jackson.databind.ObjectMapper;

@ExtendWith(MockitoExtension.class)
class ExplorationRecorderUnitTest {
	@Mock
	private ObjectMapper objectMapper;

	@Mock
	private RedisTemplate<String, String> redisTemplate;

	@Mock
	private ExplorationRepository explorationRepository;

	@Mock
	private WebSocketSessionManager sessionManager;

	@Mock
	private SimpMessagingTemplate messagingTemplate;

	@Mock
	private DogExplorationRepository dogExplorationRepository;

	@InjectMocks
	private ExplorationRecorder explorationRecorder;

	private String userId;
	private String explorationId;

	@BeforeEach
	void setUp() {
		userId = "1";
		explorationId = "100";
		explorationRecorder = new ExplorationRecorder(objectMapper, explorationRepository, redisTemplate,
			sessionManager, messagingTemplate, dogExplorationRepository);
	}

	@Test
	@DisplayName("산책 시작 시 Redis에 올바른 데이터가 초기화되는지 테스트")
	void testInitRecord() {
		// given
		String generatedGeoHash = Point.toUserCurrentGeoHash("35.166668", "129.066666");
		String generatedConstantGeoHash = Point.toConstantGeoHash("35.166668", "129.066666");

		ValueOperations<String, String> valueOperations = mock(ValueOperations.class);
		ListOperations<String, String> listOperations = mock(ListOperations.class);
		SetOperations<String, String> setOperations = mock(SetOperations.class);
		when(redisTemplate.opsForValue()).thenReturn(valueOperations);
		when(redisTemplate.opsForList()).thenReturn(listOperations);
		when(redisTemplate.opsForSet()).thenReturn(setOperations);

		// when
		explorationRecorder.initRecord(explorationId, userId, "35.166668", "129.066666");

		// then
		verify(valueOperations).set("users:1:geohash", generatedGeoHash, 60, TimeUnit.SECONDS);
		verify(valueOperations).set("users:1:constant", generatedConstantGeoHash, 30, TimeUnit.MINUTES);
		verify(valueOperations).set("users:1:total_distance", "0");
		verify(valueOperations).set("users:1:pre_point", "35.166668,129.066666");
		verify(listOperations).rightPush("users:1:point_distance", "0");
		verify(setOperations).add("active_users", userId + ":" + explorationId);
	}

	@Test
	@DisplayName("산책 기록 중 거리 계산 및 저장이 제대로 수행되는지 테스트")
	void testRecordExploration() {
		// given
		ValueOperations<String, String> valueOperations = mock(ValueOperations.class);
		ListOperations<String, String> listOperations = mock(ListOperations.class);
		when(redisTemplate.opsForValue()).thenReturn(valueOperations);
		when(redisTemplate.opsForList()).thenReturn(listOperations);

		when(valueOperations.get("users:1:geohash")).thenReturn(Point.toUserCurrentGeoHash("35.166668", "129.066666"));
		when(valueOperations.get("users:1:pre_point")).thenReturn("35.166668,129.066666");
		when(valueOperations.get("users:1:total_distance")).thenReturn("0");

		// when
		explorationRecorder.recordExploration(userId, "35.167000", "129.067000");

		// then
		verify(valueOperations).set("users:1:geohash", Point.toUserCurrentGeoHash("35.167000", "129.067000"), 60,
			TimeUnit.SECONDS);
		verify(valueOperations).set(eq("users:1:total_distance"), argThat(distance -> {
			double distanceValue = Double.parseDouble(distance);
			return Math.abs(distanceValue - 47.77623214831248) < 0.01; // 허용 오차 0.01
		}));
		verify(valueOperations).set("users:1:pre_point", "35.167000,129.067000");
	}

	@Test
	@DisplayName("9초간 이동 거리가 90m 이상일 때 예외가 발생하는지 테스트")
	void testRecordExplorationTooFastException() {
		// given
		ValueOperations<String, String> valueOperations = mock(ValueOperations.class);
		ListOperations<String, String> listOperations = mock(ListOperations.class);
		when(redisTemplate.opsForValue()).thenReturn(valueOperations);
		when(redisTemplate.opsForList()).thenReturn(listOperations);

		when(valueOperations.get("users:1:geohash")).thenReturn(Point.toUserCurrentGeoHash("35.166668", "129.066666"));
		when(valueOperations.get("users:1:pre_point")).thenReturn("35.166668,129.066666");
		when(valueOperations.get("users:1:total_distance")).thenReturn("0");
		when(listOperations.range("users:1:point_distance", 0, -1)).thenReturn(List.of("50", "50"));

		// then
		assertThrows(ApplicationSocketException.class, () -> {
			// when
			explorationRecorder.recordExploration(userId, "35.168000", "129.068000");
		});
	}

	@Test
	@DisplayName("30분 동안 같은 GeoHash 8자리 내에 있을 때 예외가 발생하는지 테스트")
	void testRecordExplorationSameLocationFor30Minutes() {
		// given
		ValueOperations<String, String> valueOperations = mock(ValueOperations.class);
		ListOperations<String, String> listOperations = mock(ListOperations.class);
		when(redisTemplate.opsForValue()).thenReturn(valueOperations);

		String geoHash = Point.toUserCurrentGeoHash("35.166668", "129.066666");
		String constantGeoHash = Point.toConstantGeoHash("35.166668", "129.066666");

		// 사용자가 30분 동안 같은 GeoHash(8자리) 내에 있을 때를 가정
		when(valueOperations.get("users:1:geohash")).thenReturn(geoHash);
		when(valueOperations.get("users:1:constant")).thenReturn(null); // TTL이 만료되어 constant 값이 사라진 상태

		// then
		assertThrows(ApplicationSocketException.class, () -> {
			// when
			explorationRecorder.recordExploration(userId, "35.166668", "129.066666");  // 같은 위치
		});
	}

	@Test
	@DisplayName("산책 종료 시 산책 데이터가 기록되고, Redis에서 데이터가 삭제되는지 테스트")
	void testEndRecord() {
		// given
		ValueOperations<String, String> valueOperations = mock(ValueOperations.class);
		SetOperations<String, String> setOperations = mock(SetOperations.class);
		when(redisTemplate.opsForValue()).thenReturn(valueOperations);
		when(redisTemplate.opsForSet()).thenReturn(setOperations);

		Exploration exploration = mock(Exploration.class);
		when(explorationRepository.findById(anyLong())).thenReturn(Optional.of(exploration));
		when(valueOperations.get("users:1:total_distance")).thenReturn("100.5");
		when(valueOperations.get("users:1:pre_point")).thenReturn("35.166668,129.066666");

		// when
		explorationRecorder.endRecord(userId, explorationId);

		// then
		verify(exploration).end(100L);
		verify(explorationRepository).save(exploration);
		verify(setOperations).remove("active_users", userId + ":" + explorationId);
		verify(redisTemplate).delete("users:1:geohash");
		verify(redisTemplate).delete("users:1:constant");
		verify(redisTemplate).delete("users:1:point_distance");
		verify(redisTemplate).delete("users:1:pre_point");
	}
}
