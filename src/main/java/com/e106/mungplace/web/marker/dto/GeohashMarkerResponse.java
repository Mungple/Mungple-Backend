package com.e106.mungplace.web.marker.dto;

import java.util.Map;

import lombok.Builder;

@Builder
public record GeohashMarkerResponse(Map<String, GeohashMarkerInfo> markersGroupedByGeohash) {
}