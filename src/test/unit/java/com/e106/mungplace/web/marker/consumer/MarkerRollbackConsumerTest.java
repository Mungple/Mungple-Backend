package com.e106.mungplace.web.marker.consumer;

import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.*;

import java.util.List;
import java.util.UUID;
import java.util.Arrays;

import org.apache.kafka.clients.admin.NewTopic;
import org.assertj.core.api.ThrowableAssert;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.support.Acknowledgment;

import com.e106.mungplace.common.image.ImageManager;
import com.e106.mungplace.domain.image.entity.ImageInfo;
import com.e106.mungplace.domain.image.repository.MarkerImageInfoRepository;
import com.e106.mungplace.domain.marker.entity.Marker;
import com.e106.mungplace.domain.marker.repository.MarkerRepository;

@ExtendWith(MockitoExtension.class)
class MarkerRollbackConsumerTest {

	private MarkerRollbackConsumer markerRollbackConsumer;

	@Mock
	private MarkerRepository markerRepository;

	@Mock
	private ImageManager imageManager;

	@Mock
	private MarkerImageInfoRepository markerImageInfoRepository;

	@Mock
	private NewTopic markerRollbackTopic;

	@Mock
	private Acknowledgment acknowledgment;

	private UUID markerUUID;

	@BeforeEach
	void setUp() {
		when(markerRollbackTopic.name()).thenReturn("markerRollback");
		markerRollbackConsumer = new MarkerRollbackConsumer(markerRollbackTopic, markerRepository, imageManager,
			markerImageInfoRepository);
		markerUUID = UUID.randomUUID();
	}

	@DisplayName("이미지가 존재하는 경우 Marker 및 관련 이미지를 삭제하는 테스트")
	@Test
	void testRollbackMarkerEvent_SuccessWithImages() {
		// given
		Marker mockMarker = mock(Marker.class);
		ImageInfo image1 = ImageInfo.builder()
			.imageName("image1.jpg")
			.marker(mockMarker)
			.build();
		ImageInfo image2 = ImageInfo.builder()
			.imageName("image2.jpg")
			.marker(mockMarker)
			.build();
		List<ImageInfo> images = Arrays.asList(image1, image2);

		when(markerImageInfoRepository.findByMarkerId(markerUUID)).thenReturn(images);

		// when
		markerRollbackConsumer.rollbackMarkerEvent(markerUUID.toString(), acknowledgment);

		// then
		verify(imageManager, times(1)).deleteImage("image1.jpg");
		verify(imageManager, times(1)).deleteImage("image2.jpg");
		verify(markerImageInfoRepository, times(1)).delete(image1);
		verify(markerImageInfoRepository, times(1)).delete(image2);
		verify(markerRepository, times(1)).deleteById(markerUUID);
		verify(acknowledgment, times(1)).acknowledge();
	}

	@DisplayName("이미지가 없는 경우 Marker만 삭제하는 테스트")
	@Test
	void testRollbackMarkerEvent_SuccessWithoutImages() {
		// given
		when(markerImageInfoRepository.findByMarkerId(markerUUID)).thenReturn(List.of());

		// when
		markerRollbackConsumer.rollbackMarkerEvent(markerUUID.toString(), acknowledgment);

		// then
		verify(imageManager, never()).deleteImage(anyString());
		verify(markerRepository, times(1)).deleteById(markerUUID);
		verify(acknowledgment, times(1)).acknowledge();
	}

	@DisplayName("이미지 삭제 중 예외가 발생한 경우 처리 테스트")
	@Test
	void testRollbackMarkerEvent_ImageDeleteFailure() {
		// given
		Marker mockMarker = mock(Marker.class); // Marker 객체를 모킹합니다.
		ImageInfo image1 = ImageInfo.builder()
			.imageName("image1.jpg")
			.marker(mockMarker)
			.build();
		List<ImageInfo> images = Arrays.asList(image1);

		when(markerImageInfoRepository.findByMarkerId(markerUUID)).thenReturn(images);
		doThrow(new RuntimeException("Image deletion failed")).when(imageManager).deleteImage("image1.jpg");

		// when
		ThrowableAssert.ThrowingCallable callable = () -> markerRollbackConsumer.rollbackMarkerEvent(markerUUID.toString(), acknowledgment);

		// then
		assertThatThrownBy(callable).isInstanceOf(RuntimeException.class).hasMessageContaining("Image deletion failed");
		verify(markerRepository, never()).deleteById(markerUUID);
		verify(acknowledgment, never()).acknowledge();
	}
}
