package com.e106.mungplace.domain.mungple.entity;

import java.time.LocalDateTime;

public record MungpleEvent(

	String entityType,
	String geoHash,
	MungpleEventType eventType,
	LocalDateTime timestamp
) {
}
