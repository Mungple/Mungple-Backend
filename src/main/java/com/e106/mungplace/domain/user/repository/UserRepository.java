package com.e106.mungplace.domain.user.repository;

import org.springframework.data.repository.Repository;

import com.e106.mungplace.domain.user.entity.User;

public interface UserRepository extends Repository<User, Long> {
}
