package com.pgverse.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddServiceDTO {

	 @NotBlank(message = "Name cannot be blank")
	 private String name;
	
	 @NotBlank(message = "Description cannot be blank")
	 private String description;
	
	 @PositiveOrZero(message = "Price must be zero or positive")
	 private double price;
	 
	 @NotNull(message = "Please enter the Room ID")
	 private Long roomId;
	 
}
