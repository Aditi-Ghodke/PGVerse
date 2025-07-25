package com.pgverse.dto;

import com.pgverse.entities.PaymentStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString(callSuper = false)
public class PaymentReqDTO {
	
	@NotNull(message = "Please enter amount")
	private double amount;
	private PaymentStatus paymentStatus = PaymentStatus.SUCCESS;
}
