package com.e106.mungplace.web.user.dto;

import lombok.Builder;

@Builder
public record LoginResponse(
	String accessToken
) {}
