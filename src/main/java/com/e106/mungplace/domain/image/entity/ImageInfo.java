package com.e106.mungplace.domain.image.entity;

import com.e106.mungplace.common.audit.BaseTime;
import com.e106.mungplace.domain.marker.entity.Marker;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
@Entity
public class ImageInfo extends BaseTime {

	@GeneratedValue
	@Column(name = "image_id")
	@Id
	private Long id;

	@Column(nullable = false, length = 100)
	private String imageName;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "marker_id", nullable = false)
	private Marker marker;

	@Builder
	public ImageInfo(String imageName, Marker marker) {
		this.imageName = imageName;
		this.marker = marker;
	}
}