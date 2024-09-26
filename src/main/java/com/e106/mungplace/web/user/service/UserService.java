package com.e106.mungplace.web.user.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.e106.mungplace.common.image.ImageRepository;
import com.e106.mungplace.common.image.ImageStore;
import com.e106.mungplace.common.transaction.GlobalTransactional;
import com.e106.mungplace.domain.user.entity.User;
import com.e106.mungplace.domain.user.impl.UserHelper;
import com.e106.mungplace.domain.user.repository.UserRepository;
import com.e106.mungplace.web.exception.ApplicationException;
import com.e106.mungplace.web.exception.dto.ApplicationError;
import com.e106.mungplace.web.user.dto.ImageNameResponse;
import com.e106.mungplace.web.user.dto.UserInfoResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserService {

	private final UserRepository userRepository;
	private final UserHelper userHelper;
	private final ImageStore imageStore;
	private final ImageRepository imageRepository;

	public UserInfoResponse readUserInfo(Long userId) {
		return userRepository.findById(userId)
			.map(targetUser -> UserInfoResponse.builder()
				.userId(targetUser.getUserId())
				.nickname(targetUser.getNickname())
				.imageName(targetUser.getImageName())
				.build())
			.orElseThrow(() -> new ApplicationException(ApplicationError.USER_NOT_FOUND));
	}

	@GlobalTransactional
	public ImageNameResponse updateUserImage(MultipartFile imageFile) {
		User user = userHelper.getCurrentUser();
		String currentImageName = user.getImageName();
		if(currentImageName != null) {
			imageRepository.deleteImageById(currentImageName);
		}
		String userImage = imageStore.saveImage(imageFile);
		user.updateImageName(userImage);
		return new ImageNameResponse(userImage);
	}
}
