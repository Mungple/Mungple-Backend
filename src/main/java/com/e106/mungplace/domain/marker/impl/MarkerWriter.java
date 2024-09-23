package com.e106.mungplace.domain.marker.impl;

import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.e106.mungplace.common.image.ImageStore;
import com.e106.mungplace.domain.image.entity.ImageInfo;
import com.e106.mungplace.domain.image.repository.MarkerImageRepository;
import com.e106.mungplace.domain.marker.entity.Marker;
import com.e106.mungplace.domain.marker.entity.MarkerEvent;
import com.e106.mungplace.domain.marker.repository.MarkerOutboxRepository;
import com.e106.mungplace.domain.marker.repository.MarkerRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Component
public class MarkerWriter {

	private final MarkerImageRepository markerImageRepository;
	private final MarkerOutboxRepository markerOutboxRepository;
	private final MarkerRepository markerRepository;
	private final ImageStore imageStore;

	public void saveMarker(Marker marker) {
		markerRepository.save(marker);
	}

	public void saveMarkerImages(List<MultipartFile> imageFiles, Marker marker) {
		if (imageFiles != null && !imageFiles.isEmpty()) {
			imageFiles.stream()
				.map(file -> {
					String imageName = imageStore.saveImage(file);
					return new ImageInfo(imageName, marker);
				})
				.forEach(markerImageRepository::save);
		}
	}

	public void createMarkerEvent(MarkerEvent outboxEntry) {
		markerOutboxRepository.save(outboxEntry);
	}

	public void delete(Marker marker) {
		markerRepository.delete(marker);
	}
}
