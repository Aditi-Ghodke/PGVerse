package com.pgverse.service;

import com.pgverse.dto.UserReqDto;
import com.pgverse.dto.UserRespDto;

public interface UserService {

	UserRespDto registerUser(UserReqDto dto);
}
