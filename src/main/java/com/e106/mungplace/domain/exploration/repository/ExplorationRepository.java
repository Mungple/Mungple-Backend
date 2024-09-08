package com.e106.mungplace.domain.exploration.repository;

import org.springframework.data.repository.CrudRepository;

import com.e106.mungplace.domain.exploration.entity.Exploration;
import com.e106.mungplace.domain.user.entity.User;

public interface ExplorationRepository extends CrudRepository<Exploration, Long> {

	boolean existsByUserAndEndAtIsNull(User user);
}
