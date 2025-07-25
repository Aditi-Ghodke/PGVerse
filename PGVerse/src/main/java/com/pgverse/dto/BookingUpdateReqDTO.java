package com.pgverse.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingUpdateReqDTO {
	
	private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Long roomId;
    
    private Long pgId;
}
