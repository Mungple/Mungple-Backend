package com.e106.mungplace.domain.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
@Entity(name = "users")
public class User {

	@Builder
	public User(String providerId, ProviderName providerName, String nickname, String imageName) {
		this.providerId = providerId;
		this.providerName = providerName;
		this.nickname = nickname;
		this.imageName = imageName;
	}

	@GeneratedValue
	@Id
	private Long userId;

	@Column(length = 100, nullable = false, unique = true)
	private String providerId;

	@Enumerated(EnumType.STRING)
	private ProviderName providerName;

	@Column(length = 20, nullable = false)
	private String nickname;

	private String imageName;
}
