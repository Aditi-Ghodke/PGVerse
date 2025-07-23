package com.pgverse.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pgverse.entities.PgProperty;
import java.util.List;


public interface PgPropertyDao extends JpaRepository<PgProperty, Long>{

	Optional<PgProperty>findByPgId(Long pgId);
	
}
