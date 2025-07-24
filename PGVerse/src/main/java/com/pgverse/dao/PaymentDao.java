package com.pgverse.dao;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pgverse.entities.Payment;
import com.pgverse.entities.User;
import com.pgverse.entities.Booking;



public interface PaymentDao extends JpaRepository<Payment, Long>{
	boolean existsByBooking_UserAndBooking_BookingDate(
			User user, LocalDate bookingDate);
	
	boolean existsByBooking(Booking booking);

}
