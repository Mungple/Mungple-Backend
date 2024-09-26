package com.e106.mungplace.domain.marker.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.e106.mungplace.domain.marker.entity.MarkerPoint;
import com.e106.mungplace.domain.marker.entity.MarkerType;
import com.e106.mungplace.domain.marker.repository.MarkerPointRepository;

@ExtendWith(MockitoExtension.class)
class MarkerReaderTest {

	@Mock
	private MarkerPointRepository markerPointRepository;

	@InjectMocks
	private MarkerReader markerReader;

	private List<MarkerPoint> markerPoints;

	@BeforeEach
	void setUp() {
		markerPoints = new ArrayList<>();
		markerPoints.add(MarkerPoint.builder()
			.userId(100L)
			.type(MarkerType.RED)
			.build());
	}

	@Test
	void testFindMarkersByGeoDistanceAndCreatedAtRange() {
		// given
		when(markerPointRepository.findMarkersByGeoDistanceAndCreatedAtRange(anyString(), anyDouble(), anyDouble(),
			anyString(), anyString()))
			.thenReturn(markerPoints);

		// when
		List<MarkerPoint> result = markerReader.findMarkersByGeoDistanceAndCreatedAtRange("500m", 35.08968679527971,
			128.85403312444654, "2023-09-23", "2023-09-24");

		// then
		assertNotNull(result);
		assertEquals(1, result.size());
		assertEquals(MarkerType.RED, result.get(0).getType());
		verify(markerPointRepository, times(1))
			.findMarkersByGeoDistanceAndCreatedAtRange(anyString(), anyDouble(), anyDouble(), anyString(), anyString());
	}

	@Test
	void testFindMarkersByGeoDistanceAndCreatedAtRangeAndType() {
		// given
		when(markerPointRepository.findMarkersByGeoDistanceAndCreatedAtRangeAndType(anyString(), anyDouble(),
			anyDouble(), anyString(), anyString(), anyString()))
			.thenReturn(markerPoints);

		// when
		List<MarkerPoint> result = markerReader.findMarkersByGeoDistanceAndCreatedAtRangeAndType("500m",
			35.08968679527971, 128.85403312444654, "2023-09-23", "2023-09-24", "RED");

		// then
		assertNotNull(result);
		assertEquals(1, result.size());
		assertEquals(MarkerType.RED, result.get(0).getType());

		verify(markerPointRepository, times(1))
			.findMarkersByGeoDistanceAndCreatedAtRangeAndType(anyString(), anyDouble(), anyDouble(), anyString(),
				anyString(), anyString());
	}
}