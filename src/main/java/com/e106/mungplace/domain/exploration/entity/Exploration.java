package com.e106.mungplace.domain.exploration.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.e106.mungplace.common.audit.BaseTime;
import com.e106.mungplace.domain.user.entity.User;

import jakarta.persistence.*;
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

	@OneToMany(mappedBy = "exploration", cascade = CascadeType.REMOVE)
	private List<DogExploration> dogExplorations = new ArrayList<>();

	public Exploration(User user, LocalDateTime startAt) {
		this.user = user;
		this.startAt = startAt;
	}

	public Exploration(Long id, User user, LocalDateTime startAt) {
		this.id = id;
		this.user = user;
		this.startAt = startAt;
	}
	public void end(Long distance) {
		this.distance = distance;
		this.endAt = LocalDateTime.now();
	}

	public void updateId(Long id) {
		this.id = id;
	}
	public boolean isEnded() {
		return endAt != null;
	}
}
