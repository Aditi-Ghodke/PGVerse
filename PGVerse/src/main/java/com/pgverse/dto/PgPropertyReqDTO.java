package com.pgverse.dto;

import com.pgverse.entities.PgType;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PgPropertyReqDTO {
	
	@NotBlank(message = "Please enter the name")
	private String name;
	
	@NotBlank(message = "Please enter the location")
	private String location;
	
	@NotBlank(message = "Please enter the description")
	private String description;
	
	private PgType pgtype;

}
