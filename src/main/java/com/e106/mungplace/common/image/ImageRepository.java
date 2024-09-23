package com.e106.mungplace.common.image;

import java.io.InputStream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.e106.mungplace.common.transaction.RollbackableRepository;
import com.e106.mungplace.web.exception.ApplicationException;
import com.e106.mungplace.web.exception.dto.ApplicationError;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class ImageRepository extends RollbackableRepository<String, MultipartFile> {

	@Value("${minio.bucket-name}")
	private String bucketName;

	private final MinioClient minioClient;

	@Override
	protected void saveWithKey(String fileName, MultipartFile file) {
		try (InputStream inputStream = file.getInputStream()) {
			minioClient.putObject(
				PutObjectArgs.builder()
					.bucket(bucketName)
					.object(fileName)
					.stream(inputStream, file.getSize(), -1)
					.contentType(file.getContentType())
					.build()
			);
		} catch (Exception e) {
			throw new ApplicationException(ApplicationError.IMAGE_SAVE_ERROR);
		}
	}

	@Override
	public void rollbackByKey(String fileName) {
		try {
			minioClient.removeObject(
				RemoveObjectArgs.builder()
					.bucket(bucketName)
					.object(fileName)
					.build()
			);
		} catch (Exception e) {
			throw new ApplicationException(ApplicationError.IMAGE_DELETE_ERROR);
		}
	}

	public void deleteImageById(String fileName) {
		try {
			minioClient.removeObject(
				RemoveObjectArgs.builder()
					.bucket(bucketName)
					.object(fileName)
					.build()
			);
		} catch (Exception e) {
			throw new ApplicationException(ApplicationError.IMAGE_DELETE_ERROR);
		}
	}
}

