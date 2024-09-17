package com.e106.mungplace.web.manager.dto;

import java.util.List;

import org.springframework.data.elasticsearch.core.geo.GeoPoint;

public record ManagerExplorePointCreateRequest(
	String managerName,
	List<GeoPoint> points
) {
}
