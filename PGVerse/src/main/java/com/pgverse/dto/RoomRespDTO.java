package com.pgverse.dto;

import com.pgverse.entities.RoomStatus;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString(callSuper = true)
public class RoomRespDTO {
	
	private int floor;
	private int capacity;
	private int currentOccupancy;
	private double pricePerMonth;
	private  RoomStatus status; 
	private Long pgId;
	private String pgName;
	private String imagePath;
	
}
