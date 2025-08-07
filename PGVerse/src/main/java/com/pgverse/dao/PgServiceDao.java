package com.pgverse.dao;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pgverse.entities.PgProperty;
import com.pgverse.entities.PgService;
import com.pgverse.entities.Room;

public interface PgServiceDao extends JpaRepository<PgService, Long>{

	List<PgService> findByRoom_Pgproperty(PgProperty room_Pgproperty);
	
	 List<PgService> findByRoomRoomId(Long roomId);
	 
	 @Query("SELECT s FROM PgService s WHERE s.room.pgproperty.pgId = :pgId")
	 List<PgService> findServicesByPgId(@Param("pgId") Long pgId);

	List<PgService> findByRoom(Room room);

}
