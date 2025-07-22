package com.pgverse.service;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.pgverse.custom_exceptions.ApiException;
import com.pgverse.custom_exceptions.ResourceNotFoundException;
import com.pgverse.dao.OwnerDao;
import com.pgverse.dto.ChangePasswordDTO;
import com.pgverse.dto.LoginReqDTO;
import com.pgverse.dto.OwnerRespDto;
import com.pgverse.dto.UpdateUserDTO;
import com.pgverse.dto.UserRespDto;
import com.pgverse.entities.Owner;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class OwnerServiceImpl implements OwnerService{

    private final BCryptPasswordEncoder passwordEncoder;
    private final OwnerDao ownerDao;
    private final ModelMapper modelMapper;
    
	@Override
	public OwnerRespDto ownerLogin(LoginReqDTO dto) {
		
		Owner owner = ownerDao.findByEmail(dto.getEmail())
				.orElseThrow(()-> new ApiException("Invalid email or password"));
		
		if (!passwordEncoder.matches(dto.getPassword(), owner.getPassword())) {
		    throw new ApiException("Invalid email or password");
		}

//		if(!dto.getPassword().equals(owner.getPassword())) {
//			throw new ApiException("Invalid email or password");
//		}
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
//		if(dto.getOldPassword().equals(owner.getPassword())) {
//			 throw new ApiException("Old password is incorrect");
//		}
		
		owner.setPassword(passwordEncoder.encode(dto.getNewPassword()));
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

}
