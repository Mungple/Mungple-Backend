package com.e106.mungplace.web.marker.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import lombok.Builder;

@Builder
public record MarkerInfoResponse(
	
	UUID id,
	long userId,
	double latitude,
	double longitude,
	String title,
	String content,
	String type,
	List<String> images,
	LocalDateTime createdAt
) {}