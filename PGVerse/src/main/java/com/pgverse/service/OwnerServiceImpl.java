package com.pgverse.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.pgverse.custom_exceptions.ApiException;
import com.pgverse.custom_exceptions.ResourceNotFoundException;
import com.pgverse.dao.OwnerDao;
import com.pgverse.dao.PgPropertyDao;
import com.pgverse.dao.RoomDao;
import com.pgverse.dto.ApiResponse;
import com.pgverse.dto.ChangePasswordDTO;
import com.pgverse.dto.LoginReqDTO;
import com.pgverse.dto.OwnerRespDto;
import com.pgverse.dto.PgPropertyReqDTO;
import com.pgverse.dto.PgPropertyRespDTO;
import com.pgverse.dto.RoomReqDTO;
import com.pgverse.dto.RoomRespDTO;
import com.pgverse.dto.UpdateUserDTO;
import com.pgverse.dto.UserRespDto;
import com.pgverse.entities.Owner;
import com.pgverse.entities.PgProperty;
import com.pgverse.entities.PgType;
import com.pgverse.entities.Room;
import com.pgverse.entities.Status;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class OwnerServiceImpl implements OwnerService{

    private final BCryptPasswordEncoder passwordEncoder;
    private final OwnerDao ownerDao;
    private final ModelMapper modelMapper;
    private final PgPropertyDao pgPropertyDao;
    private final RoomDao roomDao;
    
    //OWNER LOGIN
	@Override
	public OwnerRespDto ownerLogin(LoginReqDTO dto) {
		
		Owner owner = ownerDao.findByEmail(dto.getEmail())
				.orElseThrow(()-> new ApiException("Invalid email or password"));
		
		if (!passwordEncoder.matches(dto.getPassword(), owner.getPassword())) {
		    throw new ApiException("Invalid email or password");
		}
		return modelMapper.map(owner,OwnerRespDto.class);
	}

	
	//GET OWNER BY ID
	@Override
	public OwnerRespDto getAllOwnerById(Long id) {
		return ownerDao.findByOwnerId(id)
				.map(owner-> modelMapper.map(owner, OwnerRespDto.class))
				.orElseThrow(()-> new ApiException("Owner Not Found!"));
			
	}

	
	//CHANGE OWNER PASSWORD
	@Override
	public String changePassword(ChangePasswordDTO dto) {
		
		Owner owner = ownerDao.findByEmail(dto.getEmail())
				.orElseThrow(()-> new ApiException("Owner not found"));
				
		 if (!passwordEncoder.matches(dto.getOldPassword(), owner.getPassword())) {
		        throw new ApiException("Old password is incorrect");
		    }
		owner.setPassword(passwordEncoder.encode(dto.getNewPassword()));
		ownerDao.save(owner);
		return "Password updated successfully";
	}

	
	//UPDATE OWNER
	@Override
	public OwnerRespDto updateUserDetails(Long id, UpdateUserDTO dto) {
		Owner owner = ownerDao.findByOwnerId(id)
				.orElseThrow(()->new ResourceNotFoundException("Owner Not Found!"));
		modelMapper.map(dto,owner);
		ownerDao.save(owner);
		
		return modelMapper.map(owner, OwnerRespDto.class);
	}


	//ADD PROPERTY
	@Override
	public PgPropertyRespDTO addPgProperty(PgPropertyReqDTO dto, Long ownerId) {
		
		Owner owner  = ownerDao.findByOwnerId(ownerId)
				.orElseThrow(() -> new ResourceNotFoundException("Owner not found"));
		
		PgProperty pg = modelMapper.map(dto, PgProperty.class);
		pg.setStatus(Status.AVAILABLE);
		pg.setPgType(PgType.GIRLS);
		pg.setOwner(owner);
		PgProperty savedPg = pgPropertyDao.save(pg);
		PgPropertyRespDTO res = modelMapper.map(savedPg, PgPropertyRespDTO.class);
		res.setOwnerid(owner.getOwnerId());
		res.setOwnername(owner.getName());
		return res;
	}


	//UPDATE PROPERTY
	@Override
	public PgPropertyRespDTO updatePgProperty(Long id, PgPropertyReqDTO dto) {
		
		PgProperty pgproperty = pgPropertyDao.findByPgId(id)
				.orElseThrow(()->new ResourceNotFoundException("PG Not Found!"));
		modelMapper.map(dto,pgproperty);
		PgProperty updated =  pgPropertyDao.save(pgproperty);
		
		PgPropertyRespDTO res = modelMapper.map(updated, PgPropertyRespDTO.class);
		res.setOwnerid(updated.getOwner().getOwnerId());
		res.setOwnername(updated.getOwner().getName());
		
		return res;
	}


	//DELTE PROPERTY
	@Override
	public ApiResponse deletePgProperty(Long id) {
		PgProperty pgproperty = pgPropertyDao.findByPgId(id)
				.orElseThrow(()->new ResourceNotFoundException("PG Not Found!"));
		pgPropertyDao.delete(pgproperty);
		return new ApiResponse("PG Deleted Successfully!");
	}


	@Override
	public PgPropertyRespDTO getPropertyById(Long id) {
		PgProperty pgproperty = pgPropertyDao.findByPgId(id)
				.orElseThrow(()-> new ResourceNotFoundException("Pg not found!"));
		PgPropertyRespDTO pgpropertydto = modelMapper.map(pgproperty, PgPropertyRespDTO.class);
		pgpropertydto.setOwnerid(pgproperty.getOwner().getOwnerId());
		pgpropertydto.setOwnername(pgproperty.getOwner().getName());
		return pgpropertydto;
	}


	@Override
	public RoomRespDTO addRoomToPg(Long pgId, @Valid RoomReqDTO roomDto) {
		PgProperty pg = pgPropertyDao.findByPgId(pgId)
				.orElseThrow(()-> new ResourceNotFoundException("PG Not Found!"));
		
		Room room = modelMapper.map(roomDto, Room.class);
		room.setPgproperty(pg);
		
		Room savedRoom = roomDao.save(room);
		pg.getRooms().add(savedRoom);
		
		pgPropertyDao.save(pg);
		
		RoomRespDTO dto = modelMapper.map(savedRoom, RoomRespDTO.class);
		dto.setPgId(savedRoom.getPgproperty().getPgId());
		dto.setPgName(savedRoom.getPgproperty().getName());
		
		return  dto;
	}


	@Override
	public RoomRespDTO updateRoom(Long roomId, RoomReqDTO roomDto) {
		
		Room room = roomDao.findByRoomId(roomId)
				.orElseThrow(()-> new ResourceNotFoundException("Room not Found!"));
		
		modelMapper.map(roomDto, room);
		Room updatedRoom = roomDao.save(room);
		
		RoomRespDTO dto = modelMapper.map(updatedRoom, RoomRespDTO.class);
		dto.setPgId(updatedRoom.getPgproperty().getPgId());
		dto.setPgName(updatedRoom.getPgproperty().getName());
		
		return dto;
	}


	//DELETE ROOM BY ROOM ID
	@Override
	public ApiResponse deleteRoom(Long roomId) {
		Room room = roomDao.findByRoomId(roomId)
				.orElseThrow(()-> new ResourceNotFoundException("Room not Found!"));
		
		roomDao.delete(room);
		
		return new ApiResponse("Room deleted successfully!");
	}


	//GET ALL ROOMS BY PGID
	@Override
	public List<RoomRespDTO> getAllRooms(Long pgId) {
		PgProperty pgProp = pgPropertyDao.findByPgId(pgId)
				.orElseThrow(() -> new ResourceNotFoundException("PG Property not found"));
		return pgProp.getRooms().stream()
				.map(room->modelMapper.map(room, RoomRespDTO.class))
				.collect(Collectors.toList());
	}


	//GET ROOM BY ROOM ID
	@Override
	public RoomRespDTO getRoomById(Long roomId) {
		Room room = roomDao.findByRoomId(roomId)
				.orElseThrow(() -> new ResourceNotFoundException("Room not found"));
		RoomRespDTO dto = modelMapper.map(room, RoomRespDTO.class);
		dto.setPgId(room.getPgproperty().getPgId());
		dto.setPgName(room.getPgproperty().getName());
		return dto;
	}
}
