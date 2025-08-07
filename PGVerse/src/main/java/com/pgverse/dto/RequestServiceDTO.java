package com.pgverse.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class RequestServiceDTO {
	
	@NotNull(message = "Please enter the User Id")
	private Long userId;
	
	@NotNull(message = "Please enter the Service Id")
    private Long serviceId;
	
	@NotNull(message = "Please enter the Room Id")
    private Long roomId;
	
	@NotNull(message = "Please enter the PG Id")
    private Long pgId;
}
