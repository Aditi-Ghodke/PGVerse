package com.pgverse.service;

import java.util.List;

import com.pgverse.dto.PGRoomResponseDTO;
import com.pgverse.dto.PgPropertyRespDTO;
import com.pgverse.dto.ReviewRespDTO;

public interface PgPropertyService {

	List<PgPropertyRespDTO> getAllPg();

	PgPropertyRespDTO getPgById(Long pgId);

	PGRoomResponseDTO getRoomsPgId(Long pgId);

	List<ReviewRespDTO>  getReviewsByPgId(Long pgId);

}
