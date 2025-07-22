package com.pgverse.service;

import java.util.List;

import com.pgverse.dto.OwnerReqDto;
import com.pgverse.dto.AdminRespDTO;
import com.pgverse.dto.ApiResponse;
import com.pgverse.dto.LoginReqDTO;
import com.pgverse.dto.OwnerRespDto;
import com.pgverse.dto.UserRespDto;

public interface AdminService {
	AdminRespDTO loginAdmin(LoginReqDTO dto);

	List<UserRespDto> getAllUsers();

	UserRespDto getUserById(Long id);

	OwnerRespDto addOwner(OwnerReqDto dto);

	 List<OwnerRespDto> getAllOwners();

	OwnerRespDto getOwnerById(Long id);

	ApiResponse deleteOwner(Long id);
	
	
}
