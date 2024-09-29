package com.e106.mungplace.domain.marker.impl;

import java.util.Optional;

import org.springframework.stereotype.Component;

import com.e106.mungplace.web.marker.dto.MarkerPayload;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
@Component
public class MarkerSerializer {

	private final ObjectMapper objectMapper;

	public Optional<String> serializeMarker(MarkerPayload markerPayload) {
		try {
			return Optional.of(objectMapper.writeValueAsString(markerPayload));
		} catch (JsonProcessingException e) {
			log.error("MarkerPayload 객체를 JSON으로 변환하는 중 오류 발생: {}", markerPayload.getMarkerId(), e);
			return Optional.empty();
		}
	}

	public Optional<MarkerPayload> deserializeMarker(String payload) {
		try {
			if (payload.startsWith("\"") && payload.endsWith("\"")) {
				payload = objectMapper.readValue(payload, String.class);
			}
			return Optional.of(objectMapper.readValue(payload, MarkerPayload.class));
		} catch (JsonProcessingException e) {
			log.error("JSON 문자열을 Marker 객체로 변환하는 중 오류 발생: {}", payload, e);
			return Optional.empty();
		}
	}
}
