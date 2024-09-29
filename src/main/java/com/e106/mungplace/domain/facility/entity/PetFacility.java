package com.e106.mungplace.domain.facility.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
@Entity
public class PetFacility {

	@GeneratedValue
	@Id
	private Long id;

	private String name;
	private String address;
	private String phone;

	@Column(length = 512)
	private String homepage;
	private Double lat;
	private Double lon;
	private String closedDays;
	private String businessHours;
	private String description;

	@Builder
	public PetFacility(String name, String address, String phone, String homepage, Double lat, Double lon,
		String closedDays, String businessHours, String description) {
		this.name = name;
		this.address = address;
		this.phone = phone;
		this.homepage = homepage;
		this.lat = lat;
		this.lon = lon;
		this.closedDays = closedDays;
		this.businessHours = businessHours;
		this.description = description;
	}
}
