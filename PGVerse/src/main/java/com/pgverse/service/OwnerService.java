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
import com.pgverse.dto.RequestedServiceResponseDTO;
import com.pgverse.dto.ReviewRespDTO;
import com.pgverse.dto.AddServiceDTO;
import com.pgverse.dto.RoomReqDTO;
import com.pgverse.dto.RoomRespDTO;
import com.pgverse.dto.AddedServiceResponseDTO;
import com.pgverse.dto.UpdateUserDTO;

public interface OwnerService {
	
	//----------OWNERS-----------

	OwnerRespDto ownerLogin(LoginReqDTO dto);

	OwnerRespDto getAllOwnerById(Long id);

	String changePassword(ChangePasswordDTO dto);

	OwnerRespDto updateOwner(Long id, UpdateUserDTO dto);
	
	//----------PGPROPERTY-----------
	
	PgPropertyRespDTO addPgProperty(PgPropertyReqDTO dto, MultipartFile imageFile, Long ownerId) throws IOException;

	PgPropertyRespDTO updatePgProperty(Long id,  MultipartFile imageFile, PgPropertyReqDTO dto);
	
	ApiResponse deletePgProperty(Long id);

	PgPropertyRespDTO getPropertyById(Long id);
	
	List<PgPropertyRespDTO> getPgByOwnerId(Long ownerId);
	
	//----------ROOMS-----------

	RoomRespDTO addRoomToPg(Long pgId,MultipartFile imageFile, RoomReqDTO roomDto);

	RoomRespDTO updateRoom(Long roomId,MultipartFile imageFile, RoomReqDTO roomDto);

	ApiResponse deleteRoom(Long roomId);

	List<RoomRespDTO> getAllRooms(Long pgId);

	RoomRespDTO getRoomById(Long roomId);

	//----------BOOKINGS-----------

	List<BookingRespDTO> getBookingsByPgId(Long pgId);

	AddedServiceResponseDTO addService(Long ownerId, AddServiceDTO dto);

	List<RequestedServiceResponseDTO> getRequestedServicesById(Long pgId);
	
	List<AddedServiceResponseDTO> getServicesById(Long pgId);

	List<ReviewRespDTO> reviewForPg(Long pgId);

	void updateCompletedBookings();
}
