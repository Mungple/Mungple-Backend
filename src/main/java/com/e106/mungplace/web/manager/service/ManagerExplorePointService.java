package com.e106.mungplace.web.manager.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
}
