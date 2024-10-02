package com.e106.mungplace.domain.marker.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.e106.mungplace.domain.marker.entity.Marker;

public interface MarkerRepository extends JpaRepository<Marker, UUID> {

	@Query("SELECT m FROM Marker m WHERE m.user.userId = :userId ORDER BY m.createdDate DESC")
	List<Marker> findFirstMarkersByUserId(@Param("userId") Long userId, Pageable pageable);

	@Query("SELECT m FROM Marker m WHERE m.user.userId = :userId AND m.createdDate < :createdAt ORDER BY m.createdDate DESC")
	List<Marker> findMarkersByUserIdAndCursor(@Param("userId") Long userId, @Param("createdAt") LocalDateTime createdAt, Pageable pageable);
}