package com.pgverse.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name="services")
@Getter
@Setter
@NoArgsConstructor
@ToString(callSuper = true)
@EqualsAndHashCode(of="serviceId", callSuper = false)
public class PgService {
	
	 @Id
	 @GeneratedValue(strategy = GenerationType.IDENTITY)
	 private Long serviceId;

	 @Column(length = 100, nullable = false)
	 private String name;

	 @Column(columnDefinition = "TEXT")
	 private String description;

	 private double price;

	 @ManyToOne(fetch = FetchType.LAZY)
	 @JoinColumn(name = "room_id", nullable = false)
	 private Room room;
	 
	 @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, orphanRemoval = true)
	 private List<UserServiceRequest> serviceRequests = new ArrayList<>();


}
