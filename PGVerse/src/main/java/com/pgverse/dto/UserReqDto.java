package com.pgverse.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserReqDto {
	@NotBlank (message = "please enter your name")
	private String name;
	@NotBlank (message = "please enter your email")
	private String email;
	@NotBlank (message = "please enter your password")
	private String password;
	@NotBlank (message = "please enter you phone number")
	private String phone;
	@NotBlank (message = "gender cannot be blank")
	private String gender;
	@NotBlank (message = "please enter your address")
	private String address;
	@NotBlank (message = "please enter your aadhar card number")
	private String card;
}
