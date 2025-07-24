package com.pgverse.dao;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pgverse.entities.Booking;
import com.pgverse.entities.BookingStatus;
import com.pgverse.entities.Room;


public interface BookingDao extends JpaRepository<Booking, Long>{
	
	boolean existsByRoom(Room room);
	
	@Query("""
		    SELECT COUNT(b) > 0 FROM Booking b
		    WHERE b.room = :room
		      AND b.status = :status
		      AND (:checkInDate < b.checkOutDate AND :checkOutDate > b.checkInDate)
		""")
		boolean isRoomBooked(@Param("room") Room room,
		                     @Param("checkInDate") LocalDate checkInDate,
		                     @Param("checkOutDate") LocalDate checkOutDate,
		                     @Param("status") BookingStatus status);


	List<Booking> findByUserUserId(Long userId);
	List<Booking> findByRoom_Pgproperty_PgId(Long pgId);
	
}
