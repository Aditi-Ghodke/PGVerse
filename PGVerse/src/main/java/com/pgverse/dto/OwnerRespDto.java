package com.pgverse.dto;

import com.pgverse.entities.Role;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString(callSuper = true)
public class OwnerRespDto {
	private Long ownerId;
	private String name;
	private String email;
	private String password;
	private String phone;
	private String gender;
	private String address;
	private String card;
	private Role role;
}
