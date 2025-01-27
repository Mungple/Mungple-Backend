package com.e106.mungplace.domain.marker.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import com.e106.mungplace.domain.image.entity.ImageInfo;
import com.e106.mungplace.domain.image.repository.MarkerImageInfoRepository;
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
	private final MarkerImageInfoRepository markerImageInfoRepository;

	public Optional<Marker> find(UUID markerId) {
		return markerRepository.findById(markerId);
	}

	public List<MarkerPoint> findMarkersByGeoDistanceAndCreatedAtRange(String distance, double latitude,
		double longitude, String gte, String lte) {
		return markerPointRepository.findMarkersByGeoDistanceAndCreatedAtRange(distance, latitude, longitude, gte, lte);
	}

	public List<MarkerPoint> findMarkersByGeoDistanceAndCreatedAtRangeAndType(String distance, double latitude,
		double longitude, String gte, String lte, String markerType) {
		return markerPointRepository.findMarkersByGeoDistanceAndCreatedAtRangeAndType(distance, latitude, longitude,
			gte, lte, markerType);
	}

	public List<ImageInfo> findMarkerImage(UUID markerId) {
		return markerImageInfoRepository.findByMarkerId(markerId);
	}

	public List<Marker> findFirstMarkersByUserId(Long userId, Long size) {
		Pageable pageable = PageRequest.of(0, size.intValue(), Sort.by("createdDate").descending());
		return markerRepository.findFirstMarkersByUserId(userId, pageable);
	}

	public List<Marker> findMarkersByUserIdAndCursor(Long userId, Long size, LocalDateTime createdAt) {
		Pageable pageable = PageRequest.of(0, size.intValue(), Sort.by("createdDate").descending());
		return markerRepository.findMarkersByUserIdAndCursor(userId, createdAt, pageable);
	}

}