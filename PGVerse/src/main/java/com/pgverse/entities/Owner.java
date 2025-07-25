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
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Entity
@Table(name="owners")
@NoArgsConstructor
@Getter
@Setter	
@ToString(callSuper = true, exclude = "pg")
@EqualsAndHashCode(of = "ownerId", callSuper = false)
public class Owner {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long ownerId;
	
	@Column(name = "owner_name", length = 20)
	private String name;
	
	@Column(length = 30, unique = true)
	private String email;
	
	@Column(length = 200, nullable = false)
	private String password;
	
	@Column(length = 10)
	private String phone;
	
	@Column(length = 10)
	private String gender;
	
	@Column(name = "user_address", length = 255)
	private String address;
	
	//@Embedded
	private String card;
	@Enumerated(EnumType.STRING)
	@Column(name = "role", nullable = false)
	private Role role = Role.OWNER;
	
	@OneToMany(mappedBy = "owner", orphanRemoval = true, cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<PgProperty> pg = new ArrayList<>();
}
