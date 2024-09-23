package com.e106.mungplace.domain.marker.impl;

import java.util.Optional;

import org.springframework.stereotype.Component;

import com.e106.mungplace.domain.marker.entity.Marker;
import com.e106.mungplace.domain.marker.repository.MarkerRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class MarkerReader {

	private final MarkerRepository markerRepository;

	public Optional<Marker> find(Long markerId) {
		return markerRepository.findById(markerId);
	}
}
