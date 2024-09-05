package com.e106.mungplace.domain.user.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.e106.mungplace.domain.user.entity.User;

public interface UserRepository extends CrudRepository<User, Long> {

	Optional<User> findUserByProviderId(String providerId);
}
