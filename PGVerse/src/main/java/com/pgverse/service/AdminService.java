package com.pgverse.service;

import java.util.List;

import com.pgverse.dto.AdminRespDTO;
import com.pgverse.dto.ApiResponse;
import com.pgverse.dto.LoginReqDTO;
import com.pgverse.dto.OwnerReqDto;
import com.pgverse.dto.OwnerRespDto;
import com.pgverse.dto.UserRespDto;

public interface AdminService {
	
	//----------ADMIN--------
	
	AdminRespDTO adminLogin(LoginReqDTO dto);
	
	//----------USERS--------

	List<UserRespDto> getAllUsers();

	UserRespDto getUserById(Long userId);
	
	//----------OWNERS--------

	OwnerRespDto addOwner(OwnerReqDto dto);

	 List<OwnerRespDto> getAllOwners();

	OwnerRespDto getOwnerById(Long ownerId);

	ApiResponse deleteOwner(Long ownerId);
}
