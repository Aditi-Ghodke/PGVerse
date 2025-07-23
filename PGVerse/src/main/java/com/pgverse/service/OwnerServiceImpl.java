package com.pgverse.service;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.pgverse.custom_exceptions.ApiException;
import com.pgverse.custom_exceptions.ResourceNotFoundException;
import com.pgverse.dao.OwnerDao;
import com.pgverse.dao.PgPropertyDao;
import com.pgverse.dto.ApiResponse;
import com.pgverse.dto.ChangePasswordDTO;
import com.pgverse.dto.LoginReqDTO;
import com.pgverse.dto.OwnerRespDto;
import com.pgverse.dto.PgPropertyReqDTO;
import com.pgverse.dto.PgPropertyRespDTO;
import com.pgverse.dto.UpdateUserDTO;
import com.pgverse.dto.UserRespDto;
import com.pgverse.entities.Owner;
import com.pgverse.entities.PgProperty;
import com.pgverse.entities.PgType;
import com.pgverse.entities.Status;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class OwnerServiceImpl implements OwnerService{

    private final BCryptPasswordEncoder passwordEncoder;
    private final OwnerDao ownerDao;
    private final ModelMapper modelMapper;
    private final PgPropertyDao pgPropertyDao;
    
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
	

}
