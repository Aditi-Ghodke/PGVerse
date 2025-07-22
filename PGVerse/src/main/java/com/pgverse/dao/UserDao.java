package com.pgverse.dao;
import org.springframework.data.jpa.repository.JpaRepository;

import com.pgverse.entities.User;
import java.util.List;
import java.util.Optional;


public interface UserDao extends JpaRepository<User,Long> {
	boolean existsByEmail(String email);
	Optional<User> findByEmail(String email);
	Optional<User> findByUserId(Long userId);
}
