package com.e106.mungplace.web.manager.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.elasticsearch.core.geo.GeoPoint;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.e106.mungplace.common.log.MethodLoggable;
import com.e106.mungplace.common.log.dto.LogAction;
import com.e106.mungplace.domain.heatmap.dto.RedzonePoint;
import com.e106.mungplace.domain.heatmap.repository.RedzonePointRepository;
import com.e106.mungplace.domain.image.entity.ImageInfo;
import com.e106.mungplace.domain.image.repository.MarkerImageInfoRepository;
import com.e106.mungplace.domain.manager.impl.ManagerReader;
import com.e106.mungplace.domain.marker.entity.Marker;
import com.e106.mungplace.domain.marker.entity.MarkerPoint;
import com.e106.mungplace.domain.marker.entity.MarkerType;
import com.e106.mungplace.domain.marker.repository.MarkerPointRepository;
import com.e106.mungplace.domain.marker.repository.MarkerRepository;
import com.e106.mungplace.domain.user.entity.User;
import com.e106.mungplace.web.manager.dto.ManagerMarkerDummyCreateRequest;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ManagerMarkerDummyService {

	private final MarkerImageInfoRepository markerImageInfoRepository;
	private final MarkerPointRepository markerPointRepository;
	private final RedzonePointRepository redzonePointRepository;
	private final MarkerRepository markerRepository;
	private final ManagerReader managerReader;

	@MethodLoggable(action = LogAction.CREATE)
	@Transactional
	public void createMarkerDummyProcess(ManagerMarkerDummyCreateRequest request) {
		User manager = managerReader.findOrCreateManager(request.managerName());

		Marker marker = request.toEntity(manager);
		Marker savedMarker = markerRepository.save(marker);
		GeoPoint geoPoint = new GeoPoint(savedMarker.getLat(), savedMarker.getLon());

		MarkerPoint markerPoint = MarkerPoint.builder()
			.markerId(savedMarker.getId())
			.userId(savedMarker.getUser().getUserId())
			.explorationId(savedMarker.getExploration() != null ? savedMarker.getExploration().getId() : null)
			.point(geoPoint)
			.createdAt(savedMarker.getCreatedDate())
			.type(savedMarker.getType())
			.build();

		markerPointRepository.save(markerPoint);

		if (marker.getType().equals(MarkerType.RED)) {
			RedzonePoint redzonePoint = new RedzonePoint(geoPoint, LocalDateTime.now());
			redzonePointRepository.save(redzonePoint);
		}

		saveMarkerImages(marker);
	}

	@MethodLoggable(action = LogAction.CREATE)
	public void saveMarkerImages(Marker marker) {
		String[] redImages = {"red-1", "red-2", "red-3"};
		String[] blueImages = {"blue-1", "blue-2", "blue-3"};

		String[] selectedImages;

		if (marker.getType().equals(MarkerType.RED)) {
			selectedImages = redImages;
		} else {
			selectedImages = blueImages;
		}

		int imageCount = (int) (Math.random() * 4);
		List<String> randomImages = getRandomImages(selectedImages, imageCount);

		randomImages.stream()
			.map(imageName -> new ImageInfo(imageName, marker))
			.forEach(markerImageInfoRepository::save);
	}

	private List<String> getRandomImages(String[] imageNames, int count) {
		List<String> selectedImages = new ArrayList<>();
		List<String> availableImages = new ArrayList<>(List.of(imageNames));

		for (int i = 0; i < count; i++) {
			int randomIndex = (int) (Math.random() * availableImages.size());
			selectedImages.add(availableImages.get(randomIndex));
			availableImages.remove(randomIndex);
		}

		return selectedImages;
	}
}