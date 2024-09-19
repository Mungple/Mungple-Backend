package com.e106.mungplace.domain.image.repository;

import org.springframework.data.repository.CrudRepository;

import com.e106.mungplace.domain.image.entity.ImageInfo;

public interface ImageInfoRepository extends CrudRepository<ImageInfo, Long> {
}
