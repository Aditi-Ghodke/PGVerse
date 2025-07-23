package com.pgverse.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pgverse.dto.ChangePasswordDTO;
import com.pgverse.dto.LoginReqDTO;
import com.pgverse.dto.PgPropertyReqDTO;
import com.pgverse.dto.UpdateUserDTO;
import com.pgverse.service.OwnerService;
import com.pgverse.service.PgPropertyService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/owner")
@AllArgsConstructor
@Validated
public class OwnerController {

	public final OwnerService ownerService;
	public final PgPropertyService pgPropertyService;
	//OWNER LOGIN
	@PostMapping("/login")
	public ResponseEntity<?> ownerLogin(@RequestBody LoginReqDTO dto){
		return ResponseEntity.ok(ownerService.ownerLogin(dto));
	}
	
	//GET OWNER BY ID
	@GetMapping("/{id}")
	public ResponseEntity<?> getAllOwnerById(@PathVariable Long id){
		return ResponseEntity.status(HttpStatus.OK)
				.body(ownerService.getAllOwnerById(id));
	}
	
	//CHNAGE PASSWORD
	@PostMapping("/change-password")
	public ResponseEntity<?> changePassword(@RequestBody ChangePasswordDTO dto){
		return ResponseEntity.ok(ownerService.changePassword(dto));
	}
	
	//UPDATE OWNER
	@PutMapping("/{id}")
	public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UpdateUserDTO dto){
		return ResponseEntity.status(HttpStatus.OK)
				.body(ownerService.updateUserDetails(id,dto));
	}
	
	//ADD PGPROPERTY
	@PostMapping("/pgpropertyyy/{ownerId}")
	public ResponseEntity<?> addPgProperty(@RequestBody PgPropertyReqDTO dto, @PathVariable Long ownerId){
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(ownerService.addPgProperty(dto, ownerId));
	}
	
	//UPDATE PGPRPERTY
	@PutMapping("/pgproperty/{id}")
	public ResponseEntity<?> updatePgProperty(@PathVariable Long id, @Valid @RequestBody PgPropertyReqDTO dto){
		return ResponseEntity.status(HttpStatus.OK)
				.body(ownerService.updatePgProperty(id, dto));
	}
	
	//DELETE PROPERTY
	@DeleteMapping("/pgproperty/{id}")
	public ResponseEntity<?> deletePgProperty(@PathVariable Long id){
		return ResponseEntity.status(HttpStatus.OK)
				.body(ownerService.deletePgProperty(id));
	}
	
	//FIND PROPERTY BY ID
	@GetMapping("/property/{id}")
	public ResponseEntity<?> getPropertyById(@PathVariable Long id){
		return ResponseEntity.status(HttpStatus.OK)
				.body(ownerService.getPropertyById(id));
	}
	
}
