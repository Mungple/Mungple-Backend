package com.e106.mungplace.web.user.dto;

import java.util.Map;

import com.e106.mungplace.domain.user.entity.ProviderName;

public record GoogleUserInfo (
	Map<String, Object> attributes
) implements OAuth2UserInfo {

	@Override
	public String getProviderId() {
		return attributes.get("sub").toString();
	}

	@Override
	public ProviderName getProviderName() {
		return ProviderName.GOOGLE;
	}

	@Override
	public String getNickname() {
		return attributes.get("name").toString();
	}
}