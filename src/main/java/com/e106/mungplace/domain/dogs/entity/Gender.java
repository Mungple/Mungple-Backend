package com.e106.mungplace.domain.dogs.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Gender {

	FEMALE("female"),
	MALE("male");

	private final String gender;
}