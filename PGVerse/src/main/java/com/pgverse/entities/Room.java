package com.pgverse.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name="rooms")
@Getter
@Setter
@NoArgsConstructor
@ToString(callSuper = true)
@EqualsAndHashCode(of="roomId", callSuper = false)
public class Room {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long roomId;
	
	@Column(nullable = false)
	private String roomNumber;
	
	@Column(nullable = false)
	private int floor;
	
	@Column(nullable = false)
	private int capacity;
	
	@Column(nullable = false)
	private int currentOccupancy;

	@Column(nullable = false)
	private double pricePerMonth;
	
	@Column(nullable = false)
	private boolean available;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "pgproperty_id", nullable = false)
	private PgProperty pgproperty;
	
}
