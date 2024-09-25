package com.e106.mungplace.web.marker.dto;

import java.util.List;

import org.springframework.data.elasticsearch.core.geo.GeoPoint;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

public record GeohashMarkerInfo(GeoPoint geohashCenter, int count, List<MarkerPointResponse> markers) {
}