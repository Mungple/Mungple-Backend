package com.e106.mungplace.domain.user.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ProviderName {
	KAKAO("kakao"),
	GOOGLE("google"),
	NAVER("naver");

	private final String providerName;
}
