package com.pgverse.dto;

import com.pgverse.entities.PgType;
import com.pgverse.entities.Status;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString(callSuper = true)
public class PgPropertyRespDTO {
	private String name;
	private String location;
	private PgType pgType;
	private Status status;
	private String description;
	private Long ownerid;
	private String ownername;
	private String imagePath;
}
