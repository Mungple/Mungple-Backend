package com.e106.mungplace.common.log.dto;

import java.util.List;

public record EventConsumeLog(
	List<String> topics,
	List<Object> values
) {
}
