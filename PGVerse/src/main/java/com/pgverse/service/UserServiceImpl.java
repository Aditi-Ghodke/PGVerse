package com.pgverse.service;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.pgverse.dao.UserDao;
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

	//private BCryptPasswordEncoder passwordEncoder;
//    UserServiceImpl(BCryptPasswordEncoder passwordEncoder) {
//        this.passwordEncoder = passwordEncoder;
//    }
	
	@Override
	public UserRespDto registerUser(UserReqDto dto) {
		User entity = modelMapper.map(dto, User.class);
		entity.setPassword(passwordEncoder.encode(dto.getPassword()));
		entity.setRole(Role.USER);
		
		
		return modelMapper.map(userDao.save(entity), UserRespDto.class);
	}

}
