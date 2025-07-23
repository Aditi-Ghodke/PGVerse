package com.pgverse.dto;

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
	private boolean available; 
	private Long pgId;
	private String pgName;
}
