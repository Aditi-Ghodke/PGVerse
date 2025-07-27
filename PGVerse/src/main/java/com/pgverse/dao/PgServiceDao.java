package com.pgverse.dao;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pgverse.entities.PgProperty;
import com.pgverse.entities.PgService;

public interface PgServiceDao extends JpaRepository<PgService, Long>{

	List<PgService> findByRoom_Pgproperty(PgProperty room_Pgproperty);
	
	 List<PgService> findByRoomRoomId(Long roomId);
}
