package com.e106.mungplace.domain.exploration.entity;

import com.e106.mungplace.domain.dogs.entity.Dog;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "dog_exploration")
public class DogExploration {

	@Id
	@Column(name = "dog_exploration_id")
	@GeneratedValue
	private Long dogExplorationId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "dog_id")
	private Dog dog;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "exploration_id")
	private Exploration exploration;

	@Column(name = "is_ended")
	private boolean isEnded;

	public void updateIsEnded(boolean flag) {
		this.isEnded = flag;
	}
}