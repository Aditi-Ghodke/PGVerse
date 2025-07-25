package com.pgverse.dto;

import java.time.LocalDate;

import com.pgverse.entities.BookingStatus;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString(callSuper = false)
public class AddBookingResDTO {

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
}
