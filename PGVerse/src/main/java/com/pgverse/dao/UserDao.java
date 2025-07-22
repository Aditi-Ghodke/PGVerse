package com.pgverse.dao;
import org.springframework.data.jpa.repository.JpaRepository;

import com.pgverse.entities.User;

public interface UserDao extends JpaRepository<User,Long> {
	
}
