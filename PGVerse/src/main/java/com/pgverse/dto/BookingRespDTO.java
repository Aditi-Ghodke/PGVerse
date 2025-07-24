package com.pgverse.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.pgverse.entities.BookingStatus;
import com.pgverse.entities.PaymentStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingRespDTO {

	private Long bookingId;
	private LocalDate bookingDate;
	private BookingStatus status; 
	private LocalDate checkInDate;
	private LocalDate checkOutDate;
	
	private Long roomId;
	
	private Long pgPropertId;
	private String pgPropertyName;
	
	
	private Long userId;
	private String userName;
	
	private Long paymentId;
	private double amount;
	private PaymentStatus paymentStatus;
	private LocalDateTime paymentDate;
	
}
