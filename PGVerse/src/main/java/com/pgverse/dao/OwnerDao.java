package com.pgverse.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pgverse.entities.Owner;
import java.util.List;


public interface OwnerDao extends JpaRepository<Owner, Long>{
	
	Optional<Owner> findByEmail(String email);
	
	Optional<Owner> findByOwnerId(Long ownerId);
}
