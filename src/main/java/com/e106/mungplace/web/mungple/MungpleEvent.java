package com.e106.mungplace.web.mungple;

import java.time.LocalDateTime;

public record MungpleEvent(

	String entityType,
	String geoHash,
	MungpleEventType eventType,
	LocalDateTime timestamp
) {
}
