package com.pgverse.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.pgverse.custom_exceptions.ResourceNotFoundException;
import com.pgverse.dao.PgPropertyDao;
import com.pgverse.dto.PGRoomResponseDTO;
import com.pgverse.dto.PgPropertyRespDTO;
import com.pgverse.dto.ReviewRespDTO;
import com.pgverse.dto.RoomRespDTO;
import com.pgverse.entities.PgProperty;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class PgPropertyImpl implements PgPropertyService{

	public final PgPropertyDao pgPropertyDao;
	public final ModelMapper modelMapper;

	//GET ALL PGPROPERTIES
	@Override
	public List<PgPropertyRespDTO> getAllPg() {
		List<PgProperty> pgproperties = pgPropertyDao.findAll();
		
		if(pgproperties.isEmpty()) {
			throw new ResourceNotFoundException("No PG available!");
		}
		return pgproperties.stream().map(pg ->{
			PgPropertyRespDTO dto = modelMapper.map(pg, PgPropertyRespDTO.class);
			dto.setOwnerid(pg.getOwner().getOwnerId());
			dto.setOwnername(pg.getOwner().getName());
			return dto;
			
		}).collect(Collectors.toList());
	}

	@Override
	public PgPropertyRespDTO getPgById(Long pgId) {
	    PgProperty pg = pgPropertyDao.findById(pgId)
	            .orElseThrow(() -> new ResourceNotFoundException("PG not found"));

	    PgPropertyRespDTO dto = modelMapper.map(pg, PgPropertyRespDTO.class);

	    dto.setOwnerid(pg.getOwner().getOwnerId());
	    dto.setOwnername(pg.getOwner().getName());

	    return dto;
	}

	@Override
	public PGRoomResponseDTO getRoomsPgId(Long pgId) {
	    PgProperty pg = pgPropertyDao.findById(pgId)
	            .orElseThrow(() -> new ResourceNotFoundException("PG not found"));

	    // Map PG entity to PGRoomResponseDTO
	    PGRoomResponseDTO dto = modelMapper.map(pg, PGRoomResponseDTO.class);
	    dto.setOwnerid(pg.getOwner().getOwnerId());
	    dto.setName(pg.getOwner().getName());

	    // Map list of Room -> RoomRespDTO
	    List<RoomRespDTO> roomDtos = pg.getRooms().stream()
	            .map(room -> {
	                RoomRespDTO roomDto = modelMapper.map(room, RoomRespDTO.class);
	                roomDto.setPgId(pg.getPgId());
	                roomDto.setPgName(pg.getName());
	                return roomDto;
	            })
	            .collect(Collectors.toList());

	    dto.setRooms(roomDtos);

	    return dto;
	}

	@Override
	public List<ReviewRespDTO> getReviewsByPgId(Long pgId) {
	    PgProperty pg = pgPropertyDao.findById(pgId)
	            .orElseThrow(() -> new ResourceNotFoundException("PG not found"));

	    List<ReviewRespDTO> reviewDtos = pg.getReviewss().stream()
	            .map(review -> {
	                ReviewRespDTO dto = modelMapper.map(review, ReviewRespDTO.class);
	                dto.setUserId(review.getUser().getUserId());
	                dto.setUserName(review.getUser().getName());
	                dto.setPgPropertyid(pg.getPgId());
	                dto.setPgPropertyName(pg.getName());
	                return dto;
	            })
	            .collect(Collectors.toList());

	    return reviewDtos;
	}



}
