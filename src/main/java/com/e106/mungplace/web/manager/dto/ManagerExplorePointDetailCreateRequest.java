package com.e106.mungplace.web.manager.dto;

import com.e106.mungplace.common.map.dto.Point;

public record ManagerExplorePointDetailCreateRequest(
	String managerName,
	Point centerPoint
) {}