package com.e106.mungplace.web.marker.consumer;

import static com.e106.mungplace.web.exception.dto.ApplicationError.*;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.apache.kafka.clients.admin.NewTopic;
import org.assertj.core.api.ThrowableAssert;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.Acknowledgment;

import com.e106.mungplace.domain.marker.entity.MarkerEvent;
import com.e106.mungplace.domain.marker.entity.MarkerPoint;
import com.e106.mungplace.domain.marker.entity.MarkerType;
import com.e106.mungplace.domain.marker.impl.MarkerSerializer;
import com.e106.mungplace.domain.marker.repository.MarkerPointRepository;
import com.e106.mungplace.web.exception.ApplicationException;
import com.e106.mungplace.web.marker.dto.MarkerPayload;
import com.fasterxml.jackson.databind.ObjectMapper;

@ExtendWith(MockitoExtension.class)
class MarkerConsumerTest {

	@Mock
	private MarkerPointRepository markerPointRepository;

	@Mock
	private Acknowledgment acknowledgment;

	@Mock
	private NewTopic markerTopic;

	@Mock
	private MarkerSerializer markerSerializer;

	@Mock
	private KafkaTemplate<String, String> kafkaTemplate;

	private MarkerConsumer markerConsumer;

	private MarkerEvent event;

	private MarkerPayload markerPayload;

	@BeforeEach
	void setUp() {
		when(markerTopic.name()).thenReturn("marker");

		markerConsumer = new MarkerConsumer(markerTopic, markerPointRepository, new ObjectMapper(), markerSerializer, kafkaTemplate);

		// Mock MarkerPayload 생성
		markerPayload = MarkerPayload.builder()
			.markerId(UUID.randomUUID())
			.userId(1L)
			.title("Test Marker")
			.lat(37.5665)
			.lon(126.978)
			.type(MarkerType.BLUE)
			.explorationId(null)
			.build();

		// Mock MarkerEvent 생성
		event = MarkerEvent.builder()
			.uuid(UUID.randomUUID())
			.entityId(UUID.randomUUID())
			.payload(
				"{\"markerId\":1,\"userId\":1,\"title\":\"Test Marker\",\"lat\":37.5665,\"lon\":126.978,\"type\":\"BLUE\",\"explorationId\":null}")
			.createdAt(LocalDateTime.now())
			.build();
	}

	@DisplayName("정상적으로 MarkerEvent를 처리하고, MarkerPoint를 저장하는 테스트")
	@Test
	void testHandleHeatmapQueryEventProcess_Success() throws Exception {
		// given
		when(markerSerializer.deserializeMarker(any())).thenReturn(Optional.of(markerPayload));

		// when
		markerConsumer.saveMarkerEventProcess(event, acknowledgment);

		// then
		verify(markerPointRepository, times(1)).save(any(MarkerPoint.class));
		verify(acknowledgment, times(1)).acknowledge();
	}

	@DisplayName("MarkerPayload 복원 실패 시 오류 로그를 출력하는 테스트")
	@Test
	void testHandleHeatmapQueryEventProcess_Failure() throws Exception {
		// given
		when(markerSerializer.deserializeMarker(any())).thenReturn(Optional.empty());

		// when
		ThrowableAssert.ThrowingCallable expectedThrow = () -> markerConsumer.saveMarkerEventProcess(event,
			acknowledgment);

		// then
		assertThatThrownBy(expectedThrow);
		verify(markerPointRepository, never()).save(any(MarkerPoint.class));
		verify(acknowledgment, never()).acknowledge();
	}

	@DisplayName("정상적으로 MarkerEvent를 처리하고, MarkerPoint를 저장하는 테스트")
	@Test
	void testSaveMarkerEventProcess_Success() throws Exception {
		// given
		when(markerSerializer.deserializeMarker(any())).thenReturn(Optional.of(markerPayload));

		// when
		markerConsumer.saveMarkerEventProcess(event, acknowledgment);

		// then
		verify(markerPointRepository, times(1)).save(any(MarkerPoint.class));
		verify(acknowledgment, times(1)).acknowledge();
		verify(kafkaTemplate, never()).send(anyString(), anyString(), anyString());
	}

	@DisplayName("MarkerPoint 저장 중 예외 발생 시 Kafka 메시지가 전송되는지 확인하는 테스트")
	@Test
	void testSaveMarkerEventProcess_SaveFailure() throws Exception {
		// given
		when(markerSerializer.deserializeMarker(any())).thenReturn(Optional.of(markerPayload));
		doThrow(new RuntimeException()).when(markerPointRepository).save(any(MarkerPoint.class));

		// when
		ThrowableAssert.ThrowingCallable expectedThrow = () -> markerConsumer.saveMarkerEventProcess(event, acknowledgment);

		// then
		assertThatThrownBy(expectedThrow).isInstanceOf(ApplicationException.class);

		verify(kafkaTemplate, times(1)).send(anyString(), anyString(), anyString());
		verify(acknowledgment, never()).acknowledge();
	}
}