package com.pgverse.dto;

import java.time.LocalDate;

import com.pgverse.entities.BookingStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingReqDTO {
	
	@NotNull(message = "Please enter Room ID")
	private Long userId;
	
	@NotNull(message = "PLease enter Room ID")
	private Long roomId;
	
	@NotNull(message = "Please enter PgID")
    private Long pgId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private BookingStatus status; 
}
