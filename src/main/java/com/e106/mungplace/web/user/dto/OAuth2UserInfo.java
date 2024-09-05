package com.e106.mungplace.web.user.dto;

import com.e106.mungplace.domain.user.entity.ProviderName;

public interface OAuth2UserInfo {

	String getProviderId();
	ProviderName getProviderName();
	String getNickname();
}
