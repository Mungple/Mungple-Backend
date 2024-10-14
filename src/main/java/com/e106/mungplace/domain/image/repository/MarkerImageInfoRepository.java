package com.e106.mungplace.domain.image.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.e106.mungplace.domain.image.entity.ImageInfo;

public interface MarkerImageInfoRepository extends JpaRepository<ImageInfo, Long> {

	List<ImageInfo> findByMarkerId(UUID markerId);
}
