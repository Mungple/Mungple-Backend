package com.e106.mungplace.web.mungple;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum MungpleEventType {

	MUNGPLE_CREATED("mungple_created"),
	MUNGPLE_REMOVED("mungple_removed");

	private final String eventType;
}
