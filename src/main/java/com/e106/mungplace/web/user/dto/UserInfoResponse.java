package com.e106.mungplace.web.user.dto;

import java.time.LocalDateTime;

import com.e106.mungplace.domain.user.entity.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
public class UserInfoResponse {

	Long userId;
	String nickname;
	String imageName;
	LocalDateTime createdAt;

	public static UserInfoResponse of(User user) {
		return builder()
			.userId(user.getUserId())
			.nickname(user.getNickname())
			.imageName(user.getImageName())
			.createdAt(user.getCreatedDate())
			.build();
	}
}