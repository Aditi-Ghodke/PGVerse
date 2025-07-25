package com.pgverse.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pgverse.entities.Room;
import java.util.List;


public interface RoomDao extends JpaRepository<Room, Long>{
	
	Optional<Room> findByRoomId(Long roomId);
	
}
