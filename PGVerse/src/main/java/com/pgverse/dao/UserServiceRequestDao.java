package com.pgverse.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pgverse.entities.PgProperty;
import com.pgverse.entities.UserServiceRequest;


public interface UserServiceRequestDao extends JpaRepository<UserServiceRequest, Long>{
	
	List<UserServiceRequest> findByPgProperty(PgProperty pgProperty);
	
	List<UserServiceRequest> findByServiceRoomRoomId(Long roomId);

}
