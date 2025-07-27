package com.pgverse.service;

import java.util.List;

import com.pgverse.dto.AddBookingResDTO;
import com.pgverse.dto.ApiResponse;
import com.pgverse.dto.BookingReqDTO;
import com.pgverse.dto.BookingRespDTO;
import com.pgverse.dto.ChangePasswordDTO;
import com.pgverse.dto.LoginReqDTO;
import com.pgverse.dto.LoginRespDTO;
import com.pgverse.dto.PaymentReqDTO;
import com.pgverse.dto.RequestServiceDTO;
import com.pgverse.dto.RequestedServiceResponseDTO;
import com.pgverse.dto.ReviewReqDTO;
import com.pgverse.dto.ReviewRespDTO;
import com.pgverse.dto.AddedServiceResponseDTO;
import com.pgverse.dto.UpdateUserDTO;
import com.pgverse.dto.UserReqDto;
import com.pgverse.dto.UserRespDto;

import jakarta.validation.Valid;

public interface UserService {
	
	//-------USER---------

	UserRespDto registerUser(UserReqDto dto);
	
	UserRespDto loginUser(LoginReqDTO loginDto);

	String changePassword(ChangePasswordDTO dto);

	UserRespDto getUserById(Long userId);

	UserRespDto updateUserDetails(Long userId, UpdateUserDTO dto);

	ApiResponse deleteUser(Long userId);
	
	//----------REVIEW-------------

	ReviewRespDTO giveReview(ReviewReqDTO dto, Long pgId, Long userId);

	ReviewRespDTO updateReview(Long reiewId, ReviewReqDTO dto);

	List<ReviewRespDTO> getReviewById(Long reviewId);
	
	List<ReviewRespDTO> reviewForPg(Long pgId);

	ApiResponse deleteReview(Long reviewId);
	
	//----------BOOKING-------------
	
	AddBookingResDTO createBooking(BookingReqDTO dto);
	
	BookingRespDTO makePayment(Long bookingId, PaymentReqDTO paymentDTO);

	List<BookingRespDTO> getBookingsByUserId(Long userId);

	BookingRespDTO cancelBookingsByUserId(Long userId, Long bookingId);
	
	BookingRespDTO getBookingById(Long bookingId);

	RequestedServiceResponseDTO requestService(@Valid RequestServiceDTO dto);
}
