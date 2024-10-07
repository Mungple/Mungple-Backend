package com.e106.mungplace.domain.marker.impl;

import static org.mockito.Mockito.*;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import com.e106.mungplace.common.image.ImageManager;
import com.e106.mungplace.domain.image.entity.ImageInfo;
import com.e106.mungplace.domain.image.repository.MarkerImageInfoRepository;
import com.e106.mungplace.domain.marker.entity.Marker;
import com.e106.mungplace.domain.marker.entity.MarkerEvent;
import com.e106.mungplace.domain.marker.entity.MarkerType;
import com.e106.mungplace.domain.marker.repository.MarkerOutboxRepository;
import com.e106.mungplace.domain.marker.repository.MarkerRepository;

@ExtendWith(MockitoExtension.class)
class MarkerWriterTest {

	@Mock
	private MarkerImageInfoRepository markerImageInfoRepository;

	@Mock
	private MarkerOutboxRepository markerOutboxRepository;

	@Mock
	private MarkerRepository markerRepository;

	@Mock
	private ImageManager imageManager;

	@InjectMocks
	private MarkerWriter markerWriter;

	private Marker marker;
	private MarkerEvent markerEvent;

	@BeforeEach
	void setUp() {
		marker = Marker.builder()
			.content("content")
			.type(MarkerType.RED)
			.title("title")
			.build();
		markerEvent = new MarkerEvent();
	}

	@DisplayName("마커를 저장하는 테스트")
	@Test
	void testSaveMarker() {
		markerWriter.saveMarker(marker);

		// Verify that the marker is saved
		verify(markerRepository, times(1)).save(marker);
	}

	@DisplayName("이미지를 저장하는 테스트")
	@Test
	void testSaveMarkerImages() {
		// given
		MultipartFile file1 = mock(MultipartFile.class);
		MultipartFile file2 = mock(MultipartFile.class);

		when(imageManager.saveImage(file1)).thenReturn("image1.jpg");
		when(imageManager.saveImage(file2)).thenReturn("image2.jpg");

		// when
		markerWriter.saveMarkerImages(List.of(file1, file2), marker);

		// then
		verify(markerImageInfoRepository, times(2)).save(any(ImageInfo.class));
		verify(imageManager, times(1)).saveImage(file1);
		verify(imageManager, times(1)).saveImage(file2);
	}

	@DisplayName("마커 이벤트를 생성하는 테스트")
	@Test
	void testCreateMarkerEvent() {
		// given

		// when
		markerWriter.createMarkerEvent(markerEvent);

		// then
		verify(markerOutboxRepository, times(1)).save(markerEvent);
	}

	@DisplayName("마커와 관련된 이미지를 삭제하는 테스트")
	@Test
	void testDeleteMarker() {
		// given
		ImageInfo imageInfo1 = new ImageInfo("image1.jpg", marker);
		ImageInfo imageInfo2 = new ImageInfo("image2.jpg", marker);
		List<ImageInfo> imageInfos = List.of(imageInfo1, imageInfo2);

		when(markerImageInfoRepository.findByMarkerId(marker.getId())).thenReturn(imageInfos);

		// when
		markerWriter.delete(marker);

		// then
		verify(imageManager, times(1)).deleteImage("image1.jpg");
		verify(imageManager, times(1)).deleteImage("image2.jpg");

		verify(markerImageInfoRepository, times(1)).deleteAll(imageInfos);

		verify(markerRepository, times(1)).delete(marker);
	}
}