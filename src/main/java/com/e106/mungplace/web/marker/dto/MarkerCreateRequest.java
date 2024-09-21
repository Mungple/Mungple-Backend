package com.e106.mungplace.web.marker.dto;

import com.e106.mungplace.domain.exploration.entity.Exploration;
import com.e106.mungplace.domain.marker.entity.Marker;
import com.e106.mungplace.domain.marker.entity.MarkerType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

@Getter
@Builder
@RequiredArgsConstructor
@ToString
@AllArgsConstructor
public class MarkerCreateRequest {

	Double lat;
	Double lon;
	String title;
	String content;
	Long explorationId;
	MarkerType markerType;

	public Marker toEntity() {
		return Marker.builder()
			.lat(this.lat)
			.lon(this.lon)
			.title(this.title)
			.content(this.content)
			.type(this.markerType)
			.build();
	}

	public Marker toEntity(Exploration exploration) {
		return Marker.builder()
			.lat(this.lat)
			.lon(this.lon)
			.title(this.title)
			.exploration(exploration)
			.content(this.content)
			.type(this.markerType)
			.build();
	}
}
