package com.e106.mungplace.web.marker.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class MarkerPointResponse {

	private UUID markerId;
	private Long userId;
	private LocalDateTime createdAt;
	private String type;
}
