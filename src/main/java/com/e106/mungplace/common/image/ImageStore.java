package com.e106.mungplace.common.image;

import java.util.UUID;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.e106.mungplace.web.exception.ApplicationException;
import com.e106.mungplace.web.exception.dto.ApplicationError;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class ImageStore {

	private final ImageRepository imageRepository;

	public String saveImage(MultipartFile file) {
		String originalFileName = file.getOriginalFilename();
		String extension = originalFileName.substring(originalFileName.lastIndexOf(".") + 1).toLowerCase();

		if (!isValidImageExtension(extension)) {
			throw new ApplicationException(ApplicationError.IMAGE_NOT_SUPPORTED);
		}

		String uuid = UUID.randomUUID().toString();
		String storedFileName = uuid + "." + extension;
		imageRepository.save(storedFileName, file);
		return storedFileName;
	}

	private boolean isValidImageExtension(String extension) {
		return extension.equals("jpg") || extension.equals("jpeg") || extension.equals("png");
	}
}