package com.pgverse.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pgverse.service.PgPropertyService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/pgproperty")
@AllArgsConstructor
@Validated
public class PgPropertyController {

	public final PgPropertyService pgservice;
	
	@GetMapping()
	public ResponseEntity<?> getAllPg(){
		return ResponseEntity.status(HttpStatus.OK)
				.body(pgservice.getAllPg());
	}
}
