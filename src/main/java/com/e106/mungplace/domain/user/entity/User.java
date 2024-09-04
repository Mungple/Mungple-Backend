package com.e106.mungplace.domain.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Builder;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Entity(name = "users")
public class User {

	@Builder
	public User(String providerId, ProviderName providerName, String nickName, String imageName) {
		this.providerId = providerId;
		this.providerName = providerName;
		this.nickName = nickName;
		this.imageName = imageName;
	}

	@GeneratedValue
	@Id
	private Long userId;

	@Column(length = 100, nullable = false, unique = true)
	private String providerId;

	@Enumerated(EnumType.STRING)
	private ProviderName providerName;

	@Column(length = 20, nullable = false, unique = true)
	private String nickName;

	private String imageName;
}
