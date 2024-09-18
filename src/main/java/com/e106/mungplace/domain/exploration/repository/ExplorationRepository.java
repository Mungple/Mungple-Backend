package com.e106.mungplace.domain.exploration.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.e106.mungplace.domain.exploration.entity.Exploration;
import com.e106.mungplace.domain.user.entity.User;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ExplorationRepository extends CrudRepository<Exploration, Long> {

	boolean existsByUserAndEndAtIsNull(User user);

	@Query("SELECT e FROM Exploration e WHERE e.user.userId = :userId AND e.startAt BETWEEN :startDate AND :endDate AND e.endAt IS NOT NULL")
	List<Exploration> findByUserIdAndStartAtBetween(
			@Param("userId") Long userId,
			@Param("startDate") LocalDateTime startDate,
			@Param("endDate") LocalDateTime endDate
	);
}
