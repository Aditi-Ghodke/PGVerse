package com.pgverse.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pgverse.dto.OwnerReqDto;
import com.pgverse.dto.LoginReqDTO;
import com.pgverse.service.AdminService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/admin")
@AllArgsConstructor
@Validated
public class AdminController {
	
	public final AdminService adminService;
	
	//ADMIN LOGIN
	@PostMapping("/login")
	public ResponseEntity<?> adminLogin(@RequestBody LoginReqDTO dto) {
		return ResponseEntity.ok(adminService.adminLogin(dto));
	}
	
	//GET ALL USERS
	@GetMapping("/users")
	public ResponseEntity<?> getAllUsers(){
		return ResponseEntity.status(HttpStatus.OK)
				.body(adminService.getAllUsers());
	}
	
	//GET USER BY ID
	@GetMapping("/users/{userId}")
	public ResponseEntity<?> getUserById(@PathVariable Long userId){
		return ResponseEntity.status(HttpStatus.OK)
				.body(adminService.getUserById(userId));
	}
	
	
	//ADD OWNER
	@PostMapping("/owner/register")
	public ResponseEntity<?> addOwner(@RequestBody OwnerReqDto  dto){
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(adminService.addOwner(dto));
	}
	
	
	//GET ALL OWNERS
	@GetMapping("/owners")
	public ResponseEntity<?> getAllOwners() {
	    return ResponseEntity.ok(adminService.getAllOwners());
	}
	
	//GET ALL OWNERS BY ID
	@GetMapping("/owner/{ownerId}")
	public ResponseEntity<?>getOwnerById(@PathVariable Long ownerId){
		return ResponseEntity.status(HttpStatus.OK)
				.body(adminService.getOwnerById(ownerId));
	}
	
	//DELETE OWNER
	@DeleteMapping("/owner/{ownerId}")
	public ResponseEntity<?> deleteOwner(@PathVariable Long ownerId){
		return ResponseEntity.status(HttpStatus.OK)
				.body(adminService.deleteOwner(ownerId));
	}
	
	
}
