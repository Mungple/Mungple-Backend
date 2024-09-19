package com.e106.mungplace.web.handler.filter;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import com.e106.mungplace.domain.user.entity.User;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CustomOAuth2User implements OAuth2User {

	private User user;

	@Override
	public Map<String, Object> getAttributes() {
		Map<String, Object> attributes = new HashMap<>();
		attributes.put("id", user.getUserId());
		return attributes;
	}

	@Override
	public String getName() {
		return user.getNickname();
	}

	public String getImageUrl() {
		return user.getImageName();
	}

	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of();
	}
}