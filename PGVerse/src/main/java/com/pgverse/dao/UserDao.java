package com.pgverse.dao;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pgverse.entities.User;


public interface UserDao extends JpaRepository<User,Long> {
	
	boolean existsByEmail(String email);
	
	Optional<User> findByEmail(String email);
	
	Optional<User> findByUserId(Long userId);
	
}
