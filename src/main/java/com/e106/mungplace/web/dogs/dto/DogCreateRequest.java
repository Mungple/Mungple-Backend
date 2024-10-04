package com.e106.mungplace.web.dogs.dto;

import java.time.LocalDate;
import java.util.Date;

import com.e106.mungplace.domain.dogs.entity.Dog;
import com.e106.mungplace.domain.dogs.entity.Gender;

import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
public class DogCreateRequest {

	private String petName;

	private Gender petGender;

	private Integer petWeight;

	@PastOrPresent
	private LocalDate petBirth;

	public Dog toEntity() {
		return Dog.builder()
			.dogName(this.petName)
			.gender(this.petGender)
			.weight(this.petWeight)
			.birth(this.petBirth)
			.build();
	}
}
