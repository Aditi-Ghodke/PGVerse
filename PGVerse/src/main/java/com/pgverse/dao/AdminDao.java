package com.pgverse.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pgverse.entities.Admin;
import java.util.Optional;


public interface AdminDao extends JpaRepository<Admin,Long> {
	
	Optional<Admin> findByEmail(String email);
	
}
