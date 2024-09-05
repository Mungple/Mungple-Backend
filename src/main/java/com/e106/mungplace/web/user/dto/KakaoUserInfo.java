package com.e106.mungplace.web.user.dto;

import java.util.Map;

import com.e106.mungplace.domain.user.entity.ProviderName;

public record KakaoUserInfo(
	Map<String, Object> attributes
) implements OAuth2UserInfo {

	@Override
	public String getProviderId() {
		return attributes.get("id").toString();
	}

	@Override
	public ProviderName getProviderName() {
		return ProviderName.KAKAO;
	}

	@Override
	public String getNickname() {
		Map<String, Object> properties = (Map<String, Object>) attributes.get("properties");
		return properties.get("nickname").toString();
	}
}

