package com.e106.mungplace.web.dogs.dto;

import java.util.Date;

import com.e106.mungplace.domain.dogs.entity.Gender;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
@AllArgsConstructor
public class DogUpdateRequest {

	private String petName;
	private Gender petGender;
	private Integer petWeight;
	private Date petBirth;
}
