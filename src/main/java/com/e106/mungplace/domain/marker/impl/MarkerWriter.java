package com.e106.mungplace.domain.marker.impl;

import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.e106.mungplace.common.image.ImageManager;
import com.e106.mungplace.domain.image.entity.ImageInfo;
import com.e106.mungplace.domain.image.repository.MarkerImageInfoRepository;
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

	private final MarkerImageInfoRepository markerImageInfoRepository;
	private final MarkerOutboxRepository markerOutboxRepository;
	private final MarkerRepository markerRepository;
	private final ImageManager imageManager;

	public void saveMarker(Marker marker) {
		markerRepository.save(marker);
	}

	public void saveMarkerImages(List<MultipartFile> imageFiles, Marker marker) {
		if (imageFiles != null && !imageFiles.isEmpty()) {
			imageFiles.stream()
				.map(file -> {
					String imageName = imageManager.saveImage(file);
					return new ImageInfo(imageName, marker);
				})
				.forEach(markerImageInfoRepository::save);
		}
	}

	public void createMarkerEvent(MarkerEvent outboxEntry) {
		markerOutboxRepository.save(outboxEntry);
	}

	public void delete(Marker marker) {
		List<ImageInfo> imageInfos = markerImageInfoRepository.findByMarkerId(marker.getId());
		for (ImageInfo imageInfo : imageInfos) {
			imageManager.deleteImage(imageInfo.getImageName());
		}

		markerImageInfoRepository.deleteAll(imageInfos);

		markerRepository.delete(marker);
	}
}
