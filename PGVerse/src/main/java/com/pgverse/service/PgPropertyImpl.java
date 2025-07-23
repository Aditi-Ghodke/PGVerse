package com.pgverse.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.pgverse.custom_exceptions.ResourceNotFoundException;
import com.pgverse.dao.PgPropertyDao;
import com.pgverse.dto.PgPropertyRespDTO;
import com.pgverse.entities.PgProperty;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class PgPropertyImpl implements PgPropertyService{

	public final PgPropertyDao pgPropertyDao;
	public final ModelMapper modelMapper;
	@Override
	public List<PgPropertyRespDTO> getAllPg() {
		List<PgProperty> pgproperties = pgPropertyDao.findAll();
		
		if(!pgproperties.isEmpty()) {
			throw new ResourceNotFoundException("No PG found!");
		}
		return pgproperties.stream()
				.map(pg->modelMapper.map(pg, PgPropertyRespDTO.class))
				.collect(Collectors.toList());
	}

}
