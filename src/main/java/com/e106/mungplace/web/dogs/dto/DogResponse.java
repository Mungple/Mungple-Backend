package com.e106.mungplace.web.dogs.dto;

import java.util.Date;

import com.e106.mungplace.domain.dogs.entity.Dog;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
public class DogResponse {

	private Long id;
	private Boolean isDefault;
	private String name;
	private String gender;
	private Integer weight;
	private Date birth;
	private String photo;

	public static DogResponse of(Dog dog) {
		return builder()
			.id(dog.getId())
			.isDefault(dog.getIsDefault())
			.name(dog.getDogName())
			.gender(String.valueOf(dog.getGender()))
			.birth(dog.getBirth())
			.weight(dog.getWeight())
			.photo(dog.getImageName())
			.build();
	}
}