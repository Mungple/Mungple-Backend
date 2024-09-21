package com.e106.mungplace.web.manager.dto;

import java.util.List;

import com.e106.mungplace.common.map.dto.Point;

public record ManagerExplorePointCreateRequest(
	String managerName,
	List<Point> points
) {
}
