package com.e106.mungplace.domain.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.e106.mungplace.domain.user.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findUserByProviderId(String providerId);
}
