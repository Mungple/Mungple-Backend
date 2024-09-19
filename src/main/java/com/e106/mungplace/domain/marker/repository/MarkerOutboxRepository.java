package com.e106.mungplace.domain.marker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.e106.mungplace.domain.marker.entity.MarkerOutbox;
import com.e106.mungplace.domain.marker.entity.PublishStatus;

import jakarta.persistence.LockModeType;

public interface MarkerOutboxRepository extends JpaRepository<MarkerOutbox, Long> {

	List<MarkerOutbox> findByStatus(PublishStatus status);

	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("SELECT o FROM MarkerOutbox o WHERE o.status = :status")
	List<MarkerOutbox> findByStatusWithLock(@Param("status") PublishStatus status);
}