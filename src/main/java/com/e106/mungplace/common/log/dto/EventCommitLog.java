package com.e106.mungplace.common.log.dto;

import java.util.List;

public record EventCommitLog(
	List<String> topics,
	List<Long> offsets
) {
}
