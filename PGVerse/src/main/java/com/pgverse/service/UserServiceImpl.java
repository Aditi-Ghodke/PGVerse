package com.pgverse.service;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.pgverse.custom_exceptions.ApiException;
import com.pgverse.custom_exceptions.ResourceNotFoundException;
import com.pgverse.dao.UserDao;
import com.pgverse.dto.ApiResponse;
import com.pgverse.dto.ChangePasswordDTO;
import com.pgverse.dto.LoginReqDTO;
import com.pgverse.dto.UpdateUserDTO;
import com.pgverse.dto.UserReqDto;
import com.pgverse.dto.UserRespDto;
import com.pgverse.entities.Role;
import com.pgverse.entities.User;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class UserServiceImpl implements UserService{

    private final BCryptPasswordEncoder passwordEncoder;
	private final UserDao userDao;
	private final ModelMapper modelMapper;
	
	@Override
	public UserRespDto registerUser(UserReqDto dto) {
		//check duplicate email
		if(userDao.existsByEmail(dto.getEmail())) {
			throw new ApiException("Email already exists!");
		}
		User entity = modelMapper.map(dto, User.class);
		entity.setPassword(passwordEncoder.encode(dto.getPassword()));
		entity.setRole(Role.USER);
		return modelMapper.map(userDao.save(entity), UserRespDto.class);
	}

	@Override
	public UserRespDto loginUser(LoginReqDTO loginDto) {
		User user = userDao.findByEmail(loginDto.getEmail())
				.orElseThrow(()->new ApiException("Invalid email or password"));
		
		 if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
		        throw new ApiException("Invalid email or password");
		 }
		 return modelMapper.map(user, UserRespDto.class);
	}

	@Override
	public String changePassword(ChangePasswordDTO dto) {
		User user = userDao.findByEmail(dto.getEmail())
				 .orElseThrow(() -> new ApiException("User not found"));
		
		//validate old password
		   // Validate old password
	    if (!passwordEncoder.matches(dto.getOldPassword(), user.getPassword())) {
	        throw new ApiException("Old password is incorrect");
	    }

	    // Encode and update new password
	    user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
	    userDao.save(user);

	    return "Password updated successfully";
	}

	@Override
	public UserRespDto getUserById(Long id) {

		return userDao.findByUserId(id)
				.map(user->modelMapper.map(user, UserRespDto.class))
				.orElseThrow(()->new ApiException("User Not Found!"));
	}

	@Override
	public UserRespDto updateUserDetails(Long id, UpdateUserDTO dto) {
		User user = userDao.findByUserId(id)
				.orElseThrow(()->new ResourceNotFoundException("User Not Found!"));
		modelMapper.map(dto, user);
		userDao.save(user);
				
		return modelMapper.map(user,UserRespDto.class);
	}

	@Override
	public ApiResponse deleteUser(Long id) {
		User user = userDao.findByUserId(id)
				.orElseThrow(()->new ResourceNotFoundException("User Not Found!"));
		return new ApiResponse("User Deleted Successfully!");
	}

}
