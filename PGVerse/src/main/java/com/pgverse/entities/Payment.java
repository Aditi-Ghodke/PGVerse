package com.pgverse.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name="payments")
@NoArgsConstructor
@Getter
@Setter	
@ToString(callSuper = true)
@EqualsAndHashCode(of = "paymentId", callSuper = false)
public class Payment {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long paymentId;
	
	private double amount;
	
	private LocalDateTime paymentDate;
	
	@Enumerated(EnumType.STRING)
	private PaymentStatus paymentStatus = PaymentStatus.SUCCESS;
	
	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "booking_id", nullable = false)
	private Booking booking;

}
