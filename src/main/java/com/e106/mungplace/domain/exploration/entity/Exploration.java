package com.e106.mungplace.domain.exploration.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.e106.mungplace.domain.audit.BaseTime;
import com.e106.mungplace.domain.user.entity.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
@Entity
public class Exploration extends BaseTime {

	@GeneratedValue
	@Column(name = "exploration_id")
	@Id
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false, cascade = CascadeType.REMOVE)
	@JoinColumn(name = "user_id")
	private User user;

	private Long distance;

	@Column(nullable = false)
	private LocalDateTime startAt;

	private LocalDateTime endAt;

	public Exploration(User user, LocalDateTime startAt) {
		this.user = user;
		this.startAt = startAt;
	}

	public void end(Long distance) {
		this.distance = distance;
		this.endAt = LocalDateTime.now();
	}

	public boolean isEnded() {
		return endAt != null;
	}
}
