package com.e106.mungplace.web.manager.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.gavaghan.geodesy.Ellipsoid;
import org.gavaghan.geodesy.GeodeticCalculator;
import org.gavaghan.geodesy.GlobalCoordinates;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.e106.mungplace.common.log.MethodLoggable;
import com.e106.mungplace.common.log.dto.LogAction;
import com.e106.mungplace.common.map.dto.Point;
import com.e106.mungplace.domain.exploration.entity.Exploration;
import com.e106.mungplace.domain.exploration.entity.ExplorePoint;
import com.e106.mungplace.domain.exploration.impl.ExplorationReader;
import com.e106.mungplace.domain.exploration.repository.ExplorationRepository;
import com.e106.mungplace.domain.exploration.repository.ExplorePointRepository;
import com.e106.mungplace.domain.manager.impl.ManagerReader;
import com.e106.mungplace.domain.user.entity.User;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ManagerExplorePointService {

	private final ExplorePointRepository explorePointRepository;
	private final ExplorationReader explorationReader;
	private final ManagerReader managerReader;
	private final ExplorationRepository explorationRepository;

	@MethodLoggable(action = LogAction.CREATE)
	@Transactional
	public Iterable<ExplorePoint> bulkInsertProcess(String managerName, List<Point> points) {
		User manager = managerReader.findOrCreateManager(managerName);
		Exploration exploration = explorationReader.create(manager, LocalDateTime.now());
		List<ExplorePoint> explorePoints = points.stream()
			.map((point) -> new ExplorePoint(manager.getUserId(), exploration.getId(), point, LocalDateTime.now()))
			.toList();
		exploration.end(0L);
		explorationRepository.save(exploration);
		return explorePointRepository.saveAll(explorePoints);
	}

	@Transactional
	public Iterable<ExplorePoint> bulkInsertDetailProcess(String managerName, Point centerPoint) {
		User manager = managerReader.findOrCreateManager(managerName);
		Exploration exploration = explorationReader.create(manager, LocalDateTime.now());

		List<Point> points = generatePointsWithinRadius(centerPoint, 1000, 5);

		List<ExplorePoint> explorePoints = points.stream()
			.map((point) -> new ExplorePoint(manager.getUserId(), exploration.getId(), point, LocalDateTime.now()))
			.toList();

		exploration.end(0L);
		explorationRepository.save(exploration);
		return explorePointRepository.saveAll(explorePoints);
	}

	private List<Point> generatePointsWithinRadius(Point center, int radiusMeters, int stepMeters) {
		List<Point> points = new ArrayList<>();
		GeodeticCalculator geoCalc = new GeodeticCalculator();
		Ellipsoid reference = Ellipsoid.WGS84;
		GlobalCoordinates centerCoords = new GlobalCoordinates(center.lat(), center.lon());

		for (int bearing = 0; bearing < 360; bearing += 5) {
			for (int distance = 0; distance <= radiusMeters; distance += stepMeters) {
				GlobalCoordinates newCoords = geoCalc.calculateEndingGlobalCoordinates(reference, centerCoords, bearing, distance);
				points.add(new Point(newCoords.getLatitude(), newCoords.getLongitude()));
			}
		}
		return points;
	}
}