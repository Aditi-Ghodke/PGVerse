package com.pgverse.service;

import java.util.List;

import com.pgverse.dto.ApiResponse;
import com.pgverse.dto.ChangePasswordDTO;
import com.pgverse.dto.LoginReqDTO;
import com.pgverse.dto.OwnerRespDto;
import com.pgverse.dto.PgPropertyReqDTO;
import com.pgverse.dto.PgPropertyRespDTO;
import com.pgverse.dto.RoomReqDTO;
import com.pgverse.dto.RoomRespDTO;
import com.pgverse.dto.UpdateUserDTO;

import jakarta.validation.Valid;

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

	RoomRespDTO addRoomToPg(Long pgId, RoomReqDTO roomDto);

	RoomRespDTO updateRoom(Long roomId, RoomReqDTO roomDto);

	ApiResponse deleteRoom(Long roomId);

	List<RoomRespDTO> getAllRooms(Long pgId);

	RoomRespDTO getRoomById(Long roomId);
}
