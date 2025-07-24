package com.pgverse.service;

import java.util.List;

import com.pgverse.dto.ApiResponse;
import com.pgverse.dto.ChangePasswordDTO;
import com.pgverse.dto.LoginReqDTO;
import com.pgverse.dto.ReviewReqDTO;
import com.pgverse.dto.ReviewRespDTO;
import com.pgverse.dto.UpdateUserDTO;
import com.pgverse.dto.UserReqDto;
import com.pgverse.dto.UserRespDto;

import jakarta.validation.Valid;

public interface UserService {

	UserRespDto registerUser(UserReqDto dto);
	
	UserRespDto loginUser(LoginReqDTO loginDto);

	String changePassword(ChangePasswordDTO dto);

	UserRespDto getUserById(Long id);

	UserRespDto updateUserDetails(Long id, UpdateUserDTO dto);

	ApiResponse deleteUser(Long id);

	ReviewRespDTO giveReview(ReviewReqDTO dto, Long pgId, Long userId);

	ReviewRespDTO updateReview(Long reiewId, ReviewReqDTO dto);

	List<ReviewRespDTO> getReviewById(Long reviewId);
	
	List<ReviewRespDTO> reviewForPg(Long pgId);

	ApiResponse deleteReview(Long reviewId);
}
