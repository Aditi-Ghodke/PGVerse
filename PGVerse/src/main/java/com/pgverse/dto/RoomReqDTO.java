package com.pgverse.dto;

import com.pgverse.entities.RoomStatus;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoomReqDTO {
	
	@NotBlank(message = "Please enter room number")
	private String roomNumber;
	
	@Min(value = 0, message = "Floor number must be 0 or more")
	private int floor;
	
	@Min(value = 1, message = "Capacity must be at least 1")
	private int capacity;
	
	@Min(value = 0, message = "Current occupancy must be 0 or more")
	private int currentOccupancy;

	@Min(value = 0, message = "Price must be 0 or more")
	private double pricePerMonth;
	
	private RoomStatus status;
	
	private String imagePath; 
	
}
