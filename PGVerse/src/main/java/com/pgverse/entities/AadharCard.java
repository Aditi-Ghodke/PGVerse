package com.pgverse.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class AadharCard {
	@Column(name = "aadharcard_no", length = 12, unique = true)
	private String aadharcardNumber;
}
