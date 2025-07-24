package com.pgverse.service;

import java.util.List;import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.pgverse.custom_exceptions.ApiException;
import com.pgverse.custom_exceptions.ResourceNotFoundException;
import com.pgverse.dao.AdminDao;
import com.pgverse.dao.OwnerDao;
import com.pgverse.dao.UserDao;
import com.pgverse.dto.AdminRespDTO;
import com.pgverse.dto.ApiResponse;
import com.pgverse.dto.LoginReqDTO;
import com.pgverse.dto.OwnerReqDto;
import com.pgverse.dto.OwnerRespDto;
import com.pgverse.dto.UserRespDto;
import com.pgverse.entities.Admin;
import com.pgverse.entities.Owner;
import com.pgverse.entities.Role;
import com.pgverse.entities.User;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
@Service

@Transactional
@AllArgsConstructor
public class AdminServiceImpl implements AdminService{
	public final AdminDao adminDao;

    private final BCryptPasswordEncoder passwordEncoder;
	public final UserDao userDao;
	private final ModelMapper modelMapper;
	private final OwnerDao ownerDao;
	

   
	//ADMIN LOGIN
	@Override
	public AdminRespDTO loginAdmin(LoginReqDTO dto) {
	 Admin admin = adminDao.findByEmail(dto.getEmail())
				.orElseThrow(() -> new ApiException("User not found"));
	 if(!dto.getPassword().equals(admin.getPassword())) {
		 throw new ApiException("Invalid email");
	 }
		return modelMapper.map(admin, AdminRespDTO.class);
	}
	
	//GET ALL USERS
	@Override
	public List<UserRespDto> getAllUsers() {
		List<User> users = userDao.findAll();
		
		if(!users.isEmpty()) {
			throw new ResourceNotFoundException("No tenants found.");
		}
		return users.stream()
				.map(user->modelMapper.map(user, UserRespDto.class))
				.collect(Collectors.toList());
	}

	//GET USERS BY ID
	@Override
	public UserRespDto getUserById(Long id) {
		return userDao.findByUserId(id)
				.map(user->modelMapper.map(user, UserRespDto.class))
				.orElseThrow(()->new ApiException("Tenant Not Found!"));
	}

	//ADD OWNER
	@Override
	public OwnerRespDto addOwner(OwnerReqDto dto) {
		if (ownerDao.findByEmail(dto.getEmail()).isPresent()) {
	        throw new ApiException("Email already registered!");
	    }
		
		Owner owner = modelMapper.map(dto, Owner.class);
		owner.setPassword(passwordEncoder.encode(dto.getPassword()));
		owner.setRole(Role.OWNER);
		return modelMapper.map(ownerDao.save(owner),OwnerRespDto.class);
		
	}

	//GET ALL OWNERS
	@Override
	public List<OwnerRespDto> getAllOwners() {
		
		List<Owner> owners = ownerDao.findAll();

	    if (owners.isEmpty()) {
	        throw new ResourceNotFoundException("No owners found.");
	    }
	    return owners.stream()
	    		.map(owner->modelMapper.map(owner, OwnerRespDto.class))
	    		.collect(Collectors.toList());
	}

	//GET OWNER BY ID
	@Override
	public OwnerRespDto getOwnerById(Long id) {
		return ownerDao.findByOwnerId(id)
				.map(owner->modelMapper.map(owner, OwnerRespDto.class))
				.orElseThrow(()->new ApiException("Owner Not Found!"));
	}

	//DELETE OWNER
	@Override
	public ApiResponse deleteOwner(Long id) {
		Owner owner = ownerDao.findByOwnerId(id)
				.orElseThrow(()->new ResourceNotFoundException("Owner Not Found!"));
		ownerDao.delete(owner);
		return new ApiResponse("Owner Deleted Successfully!");
	
		
	}
	
	
	
	

}
