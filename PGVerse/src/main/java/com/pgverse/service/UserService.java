package com.pgverse.service;

import com.pgverse.dto.ApiResponse;
import com.pgverse.dto.ChangePasswordDTO;
import com.pgverse.dto.LoginReqDTO;
import com.pgverse.dto.UpdateUserDTO;
import com.pgverse.dto.UserReqDto;
import com.pgverse.dto.UserRespDto;
import com.pgverse.entities.User;

public interface UserService {

	UserRespDto registerUser(UserReqDto dto);
	
	UserRespDto loginUser(LoginReqDTO loginDto);

	String changePassword(ChangePasswordDTO dto);

	UserRespDto getUserById(Long id);

	UserRespDto updateUserDetails(Long id, UpdateUserDTO dto);

	ApiResponse deleteUser(Long id);
}
