package com.pgverse.dto;

import java.time.LocalDateTime;

import com.pgverse.entities.PaymentStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentRespDTO {
	
	private Long paymentId;
    private double amount;
    private LocalDateTime paymentDate;
    private PaymentStatus paymentStatus;

    private Long bookingId;

}
