package com.e106.mungplace.web.user.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import com.e106.mungplace.common.image.ImageRepository;
import com.e106.mungplace.common.image.ImageManager;
import com.e106.mungplace.domain.user.entity.User;
import com.e106.mungplace.domain.user.impl.UserHelper;
import com.e106.mungplace.domain.user.repository.UserRepository;
import com.e106.mungplace.web.exception.ApplicationException;
import com.e106.mungplace.web.exception.dto.ApplicationError;
import com.e106.mungplace.web.user.dto.ImageNameResponse;
import com.e106.mungplace.web.user.dto.UserInfoResponse;

import java.util.Optional;

import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(MockitoExtension.class)
class UserServiceUnitTest {

	@Mock
	private UserRepository userRepository;

	@Mock
	private UserHelper userHelper;

	@Mock
	private ImageManager imageManager;

	@Mock
	private ImageRepository imageRepository;

	@InjectMocks
	private UserService userService;

	private User user;

	@BeforeEach
	void setUp() {
		user = new User(); // Assuming User has a no-arg constructor. Customize this as per your entity.
		user.updateImageName("oldImage.jpg");
	}

	@Test
	@DisplayName("사용자의 정보를 정상적으로 조회하는지 테스트")
	void readUserInfo_Success() {
		// given
		Long userId = 1L;
		when(userRepository.findById(userId)).thenReturn(Optional.of(user));

		// when
		UserInfoResponse response = userService.readUserInfo(userId);

		// then
		assertNotNull(response);
		verify(userRepository, times(1)).findById(userId);
	}

	@Test
	@DisplayName("사용자 정보 조회 시, 사용자를 찾지 못했을 때 예외 발생")
	void readUserInfo_UserNotFound() {
		// given
		Long userId = 1L;
		when(userRepository.findById(userId)).thenReturn(Optional.empty());

		// when & then
		ApplicationException exception = assertThrows(ApplicationException.class, () -> userService.readUserInfo(userId));
		assertEquals(ApplicationError.USER_NOT_FOUND, exception.getError());
		verify(userRepository, times(1)).findById(userId);
	}

	@Test
	@DisplayName("사용자 프로필 이미지를 업데이트하는지 테스트")
	void updateUserImage_Success() {
		// given
		MultipartFile imageFile = mock(MultipartFile.class);
		when(userHelper.getCurrentUser()).thenReturn(user);
		when(imageManager.saveImage(imageFile)).thenReturn("newImage.jpg");

		// when
		ImageNameResponse response = userService.updateUserImage(imageFile);

		// then
		assertNotNull(response);
		assertEquals("newImage.jpg", response.image());
		verify(imageRepository, times(1)).deleteImageById("oldImage.jpg");
		verify(imageManager, times(1)).saveImage(imageFile);
		verify(userHelper, times(1)).getCurrentUser();
	}

	@Test
	@DisplayName("사용자 이미지 업데이트 시, 기존 이미지가 없을 경우 정상 처리되는지 테스트")
	void updateUserImage_NoPreviousImage() {
		// given
		user.updateImageName(null); // No previous image
		MultipartFile imageFile = mock(MultipartFile.class);
		when(userHelper.getCurrentUser()).thenReturn(user);
		when(imageManager.saveImage(imageFile)).thenReturn("newImage.jpg");

		// when
		ImageNameResponse response = userService.updateUserImage(imageFile);

		// then
		assertNotNull(response);
		assertEquals("newImage.jpg", response.image());
		verify(imageRepository, times(0)).deleteImageById(anyString());
		verify(imageManager, times(1)).saveImage(imageFile);
		verify(userHelper, times(1)).getCurrentUser();
	}
}
