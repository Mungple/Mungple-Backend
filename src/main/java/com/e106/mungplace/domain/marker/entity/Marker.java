package com.e106.mungplace.domain.marker.entity;

import com.e106.mungplace.common.audit.BaseTime;
import com.e106.mungplace.domain.exploration.entity.Exploration;
import com.e106.mungplace.domain.user.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Entity
public class Marker extends BaseTime {

	@GeneratedValue
	@Column(name = "marker_id")
	@Id
	private long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "exploration_id")
	private Exploration exploration;

	@Column(length = 100, nullable = false)
	private String title;

	@Column(length = 400, nullable = false)
	private String content;

	@Column(precision = 10, nullable = false)
	private Double lat;

	@Column(precision = 10, nullable = false)
	private Double lon;

	@Column(length = 20, nullable = false)
	@Enumerated(EnumType.STRING)
	private MarkerType type;

	@Builder
	public Marker(User user, Exploration exploration, String title, String content, Double lat, Double lon,
		MarkerType type) {
		this.user = user;
		this.exploration = exploration;
		this.title = title;
		this.content = content;
		this.lat = lat;
		this.lon = lon;
		this.type = type;
	}

	public void updateUser(User user) {
		this.user = user;
	}
}

