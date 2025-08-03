package com.pgverse.dao;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pgverse.entities.Booking;
import com.pgverse.entities.BookingStatus;
import com.pgverse.entities.Room;
import com.pgverse.entities.User;
import com.pgverse.entities.PgProperty;



public interface BookingDao extends JpaRepository<Booking, Long>{
	
	boolean existsByRoom(Room room);
	
	List<Booking> findByUserUserId(Long userId);
	
	List<Booking> findByRoom_Pgproperty_PgId(Long pgId);
	
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
	
	
	//ROOM CAPACITY CHECK
	@Query("SELECT COUNT(b) FROM Booking b WHERE b.room = :room " +
		       "AND b.status = :status " +
		       "AND b.checkInDate < :endDate " +
		       "AND b.checkOutDate > :startDate")
		int countActiveBookingsForRoom(@Param("room") Room room,
		                                @Param("startDate") LocalDate startDate,
		                                @Param("endDate") LocalDate endDate,
		                                @Param("status") BookingStatus status);
	
	//UPDATE THE CURRENT OCCUPANCY
	@Query("SELECT COUNT(b) FROM Booking b WHERE b.room = :room " +
		       "AND b.status = :status " +
		       "AND :today BETWEEN b.checkInDate AND b.checkOutDate")
		int countCurrentOccupants(@Param("room") Room room,
		                          @Param("today") LocalDate today,
		                          @Param("status") BookingStatus status);


	
	Optional<Booking> findByUserUserIdAndRoomRoomIdAndPgPropertyPgIdAndStatusNot(
	        Long userId, Long roomId, Long pgId, BookingStatus cancelledStatus);
	
	@Query("SELECT b FROM Booking b WHERE b.checkOutDate < :today AND b.status = 'BOOKED'")
	List<Booking> findBookingsToMarkCompleted(@Param("today") LocalDate today);

	boolean existsByUserAndPgProperty(User user, PgProperty pgProperty);
	
	
}
