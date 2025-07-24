package com.pgverse.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.pgverse.dto.ApiResponse;
import com.pgverse.dto.BookingRespDTO;
import com.pgverse.dto.ChangePasswordDTO;
import com.pgverse.dto.LoginReqDTO;
import com.pgverse.dto.OwnerRespDto;
import com.pgverse.dto.PgPropertyReqDTO;
import com.pgverse.dto.PgPropertyRespDTO;
import com.pgverse.dto.RoomReqDTO;
import com.pgverse.dto.RoomRespDTO;
import com.pgverse.dto.UpdateUserDTO;
import com.pgverse.entities.PgProperty;

import jakarta.validation.Valid;

public interface OwnerService {

	OwnerRespDto ownerLogin(LoginReqDTO dto);

	OwnerRespDto getAllOwnerById(Long id);

	String changePassword(ChangePasswordDTO dto);

	OwnerRespDto updateOwner(Long id, UpdateUserDTO dto);
	
	//PgPropertyRespDTO addPgProperty(PgPropertyReqDTO dto, Long ownerId);

	//PgPropertyRespDTO updatePgProperty(Long id, PgPropertyReqDTO dto);

	PgPropertyRespDTO updatePgProperty(Long id,  MultipartFile imageFile, PgPropertyReqDTO dto);
	
	ApiResponse deletePgProperty(Long id);

	PgPropertyRespDTO getPropertyById(Long id);

	RoomRespDTO addRoomToPg(Long pgId,MultipartFile imageFile, RoomReqDTO roomDto);

	RoomRespDTO updateRoom(Long roomId,MultipartFile imageFile, RoomReqDTO roomDto);

	ApiResponse deleteRoom(Long roomId);

	List<RoomRespDTO> getAllRooms(Long pgId);

	RoomRespDTO getRoomById(Long roomId);

	PgPropertyRespDTO addPgProperty(PgPropertyReqDTO dto, MultipartFile imageFile, Long ownerId) throws IOException;

	List<PgPropertyRespDTO> getPgByOwnerId(Long ownerId);

	List<BookingRespDTO> getBookingsByPgId(Long pgId);
}
