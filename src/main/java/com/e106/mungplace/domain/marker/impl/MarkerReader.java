package com.e106.mungplace.domain.marker.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Component;

import com.e106.mungplace.domain.marker.entity.Marker;
import com.e106.mungplace.domain.marker.entity.MarkerPoint;
import com.e106.mungplace.domain.marker.repository.MarkerPointRepository;
import com.e106.mungplace.domain.marker.repository.MarkerRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class MarkerReader {

	private final MarkerRepository markerRepository;
	private final MarkerPointRepository markerPointRepository;

	public Optional<Marker> find(Long markerId) {
		return markerRepository.findById(markerId);
	}

	public List<MarkerPoint> findMarkersByGeoDistanceAndCreatedAtRange(String distance, double latitude, double longitude, String gte, String lte) {
		return markerPointRepository.findMarkersByGeoDistanceAndCreatedAtRange(distance, latitude, longitude, gte, lte);
	}

	public List<MarkerPoint> findMarkersByGeoDistanceAndCreatedAtRangeAndType(String distance, double latitude, double longitude, String gte, String lte, String markerType) {
		return markerPointRepository.findMarkersByGeoDistanceAndCreatedAtRangeAndType(distance, latitude, longitude, gte, lte, markerType);
	}
}