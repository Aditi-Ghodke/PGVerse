package com.pgverse.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pgverse.service.PgPropertyService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/pgproperty")
@AllArgsConstructor
public class PgPropertyController {

	public final PgPropertyService pgservice;
	
	@GetMapping("/pg")
	public ResponseEntity<?> getAllPg(){
		return ResponseEntity.status(HttpStatus.OK)
				.body(pgservice.getAllPg());
	}
	
	@GetMapping("/{pgId}")
	public ResponseEntity<?> getPgById(@PathVariable Long pgId)
	{
		return ResponseEntity.status(HttpStatus.OK)
				.body(pgservice.getPgById(pgId));
	}
	
	//GET ALL ROOMS BY PGID
	@GetMapping("/rooms/{pgId}")
	public ResponseEntity<?> getRoomsPgId(@PathVariable Long pgId)
	{
		return ResponseEntity.status(HttpStatus.OK)
				.body(pgservice.getRoomsPgId(pgId));
	}
	
	//GET ALL REVIEWS BY PG ID
	@GetMapping("/reviews/{pgId}")
	public ResponseEntity<?> getReviewsByPgId(@PathVariable Long pgId)
	{
		return ResponseEntity.status(HttpStatus.OK)
				.body(pgservice.getReviewsByPgId(pgId));
	}
}
