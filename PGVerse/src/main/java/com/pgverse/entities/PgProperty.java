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
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name="pg_property")
@Getter
@Setter
@NoArgsConstructor
@ToString(callSuper = true)
@EqualsAndHashCode(of="pgId", callSuper = false)
public class PgProperty {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long pgId;
	
	@Column(length = 100, nullable = false)
	private String name;
	
	@Column(length = 100, nullable = false)
	private String location;
	

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private PgType pgType;
	

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Status status;
	
	@Column(length = 255, nullable = false)
	private String description;
	
//	@Lob
//	@Column(name = "image", columnDefinition = "LONGBLOB")
//	private byte[] image; 
	
	
	  @Column(length = 255)
	 private String imagePath; 

	
	//mappedBy = "pgproperty" means
	//The Room entity has a field named pgproperty.
	//That field (in Room) owns the foreign key (pgproperty_id).
	@OneToMany(mappedBy = "pgproperty", orphanRemoval = true, cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<Room> rooms =  new ArrayList<>();
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "owner_id", nullable = false)
	private Owner owner;
	
	@OneToMany(mappedBy = "pgProperty", orphanRemoval = true, cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	List<Review> reviewss = new ArrayList<>();
}
