package com.pgverse.service;

import com.pgverse.dto.ApiResponse;
import com.pgverse.dto.ChangePasswordDTO;
import com.pgverse.dto.LoginReqDTO;
import com.pgverse.dto.OwnerRespDto;
import com.pgverse.dto.PgPropertyReqDTO;
import com.pgverse.dto.PgPropertyRespDTO;
import com.pgverse.dto.UpdateUserDTO;

public interface OwnerService {

	OwnerRespDto ownerLogin(LoginReqDTO dto);

	OwnerRespDto getAllOwnerById(Long id);

	String changePassword(ChangePasswordDTO dto);

	OwnerRespDto updateUserDetails(Long id, UpdateUserDTO dto);

	//ADD PROPERTY
	PgPropertyRespDTO addPgProperty(PgPropertyReqDTO dto, Long ownerId);

	PgPropertyRespDTO updatePgProperty(Long id, PgPropertyReqDTO dto);

	ApiResponse deletePgProperty(Long id);

	PgPropertyRespDTO getPropertyById(Long id);
}
