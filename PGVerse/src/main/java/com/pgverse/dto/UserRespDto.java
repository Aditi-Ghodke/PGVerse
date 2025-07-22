package com.pgverse.dto;

import com.pgverse.entities.AadharCard;
import com.pgverse.entities.Role;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString(callSuper = true)
public class UserRespDto {
	private String name;
	private String email;
	private String phone;
	private String gender;
	private String address;
	private String card;
	private Role role;
}
