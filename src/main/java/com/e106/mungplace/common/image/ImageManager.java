package com.e106.mungplace.common.image;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.e106.mungplace.domain.image.entity.ImageInfo;
import com.e106.mungplace.domain.marker.entity.Marker;
import com.e106.mungplace.web.exception.ApplicationException;
import com.e106.mungplace.web.exception.dto.ApplicationError;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class ImageManager {

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

	public void deleteImage(String storedFileName) {
		imageRepository.deleteImageById(storedFileName);
	}
}