package com.e106.mungplace.web.dogs.dto;

import java.util.Date;

import com.e106.mungplace.domain.dogs.entity.Dog;
import com.e106.mungplace.domain.dogs.entity.Gender;

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
	private Date petBirth;

	public Dog toEntity() {
		return Dog.builder()
			.dogName(this.petName)
			.gender(this.petGender)
			.weight(this.petWeight)
			.birth(this.petBirth)
			.build();
	}
}
