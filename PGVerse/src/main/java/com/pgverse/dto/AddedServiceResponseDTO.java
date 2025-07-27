package com.pgverse.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddedServiceResponseDTO {

//	 private Long userId;
//	 private String userName;

	 private Long serviceId;
	 private String serviceName;
	 private String serviceDescription;
	 private double servicePrice;

	 private Long pgId;
	 private String pgName;
	 
	 private Long roomId;
}
