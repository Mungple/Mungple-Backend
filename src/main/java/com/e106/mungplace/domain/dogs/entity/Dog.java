package com.e106.mungplace.domain.dogs.entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.e106.mungplace.common.audit.BaseTime;
import com.e106.mungplace.domain.exploration.entity.DogExploration;
import com.e106.mungplace.domain.user.entity.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Dog extends BaseTime {

	@GeneratedValue
	@Column(name = "dog_id")
	@Id
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id")
	private User user;

	@Column(nullable = false, length = 20)
	private String dogName;

	@Column(nullable = false)
	private LocalDate birth;

	@Column(nullable = false, length = 20)
	private Gender gender;

	@Column(nullable = false)
	private Integer weight;

	@Column(length = 100)
	private String imageName;

	@Column(nullable = false)
	private Boolean isDefault;

	@OneToMany(mappedBy = "dog", cascade = CascadeType.REMOVE)
	@Builder.Default
	private List<DogExploration> dogExplorations = new ArrayList<>();

	public void updateDefaultDog(boolean isDefault) {
		this.isDefault = isDefault;
	}

	public void updateDogOwner(User user) {
		this.user = user;
	}

	public void updateDogName(String dogName) {
		this.dogName = dogName;
	}

	public void updateBirth(LocalDate birth) {
		this.birth = birth;
	}

	public void updateGender(Gender gender) {
		this.gender = gender;
	}

	public void updateWeight(Integer weight) {
		this.weight = weight;
	}

	public void updateImageName(String imageName) {
		this.imageName = imageName;
	}

	public void updateIsDefault(Boolean isDefault) {
		this.isDefault = isDefault;
	}
}
