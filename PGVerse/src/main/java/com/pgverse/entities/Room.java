package com.pgverse.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
	
	@Enumerated(EnumType.STRING)
	private RoomStatus status;
	
	@Column(length = 255)
	private String imagePath; 
	
	@OneToMany(mappedBy = "room",orphanRemoval = true, cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	List<Booking> bookings = new ArrayList<>();
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "pgproperty_id", nullable = false)
	private PgProperty pgproperty;
	
	@OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<PgService> services = new ArrayList<>();
	
}
