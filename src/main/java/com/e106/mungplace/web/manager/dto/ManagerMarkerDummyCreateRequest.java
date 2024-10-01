package com.e106.mungplace.web.manager.dto;

import com.e106.mungplace.domain.marker.entity.Marker;
import com.e106.mungplace.domain.marker.entity.MarkerType;
import com.e106.mungplace.domain.user.entity.User;

public record ManagerMarkerDummyCreateRequest (
	String managerName,
	Double lat,
	Double lon,
	String title,
	String content,
	Long explorationId,
	MarkerType markerType
) {
	public Marker toEntity(User user) {
		return Marker.builder()
			.user(user)
			.lat(this.lat)
			.lon(this.lon)
			.title(this.title)
			.content(this.content)
			.type(this.markerType)
			.build();
	}
}
