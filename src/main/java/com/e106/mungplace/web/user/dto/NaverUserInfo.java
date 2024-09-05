package com.e106.mungplace.web.user.dto;

import java.util.Map;

import com.e106.mungplace.domain.user.entity.ProviderName;

public record NaverUserInfo(
	Map<String, Object> attributes
) implements OAuth2UserInfo {

	@Override
	public String getProviderId() {
		Map<String, Object> response = (Map<String, Object>) attributes.get("response");
		return response.get("id").toString();
	}

	@Override
	public ProviderName getProviderName() {
		return ProviderName.NAVER;
	}

	@Override
	public String getNickname() {
		Map<String, Object> properties = (Map<String, Object>) attributes.get("response");
		return properties.get("name").toString();
	}



}