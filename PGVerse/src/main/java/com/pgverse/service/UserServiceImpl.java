package com.pgverse.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.pgverse.custom_exceptions.ApiException;
import com.pgverse.custom_exceptions.ResourceNotFoundException;
import com.pgverse.dao.PgPropertyDao;
import com.pgverse.dao.ReviewDao;
import com.pgverse.dao.UserDao;
import com.pgverse.dto.ApiResponse;
import com.pgverse.dto.ChangePasswordDTO;
import com.pgverse.dto.LoginReqDTO;
import com.pgverse.dto.ReviewReqDTO;
import com.pgverse.dto.ReviewRespDTO;
import com.pgverse.dto.UpdateUserDTO;
import com.pgverse.dto.UserReqDto;
import com.pgverse.dto.UserRespDto;
import com.pgverse.entities.PgProperty;
import com.pgverse.entities.Review;
import com.pgverse.entities.Role;
import com.pgverse.entities.User;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class UserServiceImpl implements UserService{

    private final BCryptPasswordEncoder passwordEncoder;
	private final UserDao userDao;
	private final ModelMapper modelMapper;
	private final PgPropertyDao pgPropertyDao;
	private final ReviewDao reviewDao;
	
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
		userDao.delete(user);
		return new ApiResponse("User Deleted Successfully!");
	}

	//-------REVIEW
	
	//GIVE REVIEW
	@Override
	public ReviewRespDTO giveReview( ReviewReqDTO dto, Long pgId, Long userId) {
		PgProperty pgproperty = pgPropertyDao.findByPgId(pgId)
				.orElseThrow(()->new ResourceNotFoundException("PG Not Found!"));
		
		User user = userDao.findByUserId(userId)
				.orElseThrow(()->new ResourceNotFoundException("User Not Found!"));
		
		if(reviewDao.existsByUserAndPgProperty(user, pgproperty)) {
			throw new ApiException("You have already reviewed this pg.");
		}
		
		Review review = modelMapper.map(dto, Review.class);
		review.setUser(user);
		review.setPgProperty(pgproperty);
		return modelMapper.map(reviewDao.save(review), ReviewRespDTO.class);
	}

	//UPDATE REVIEW
	@Override
	public ReviewRespDTO updateReview(Long reiewId, ReviewReqDTO dto) {

		Review review = reviewDao.findByReviewId(reiewId)
				.orElseThrow(()->new ResourceNotFoundException("No Review Found!"));
		review.setRating(dto.getRating());
		review.setComment(dto.getComment());

		Review updated = reviewDao.save(review);
		
		ReviewRespDTO res = modelMapper.map(updated, ReviewRespDTO.class);
		res.setUserid(updated.getUser().getUserId());
		res.setPgPropertyName(updated.getUser().getName());
		res.setPgPropertyid(updated.getPgProperty().getPgId());
		res.setPgPropertyName(updated.getPgProperty().getName());
		return res;
		
	}

	//GET REVIEW BY USERID
	@Override
	public List<ReviewRespDTO> getReviewById(Long userId) {
		User user = userDao.findByUserId(userId)
				.orElseThrow(()->new ResourceNotFoundException("User Not Found!"));
		List<Review> reviews = reviewDao.findByUser(user);
		return reviews.stream().map(review -> {
			ReviewRespDTO dto = modelMapper.map(review, ReviewRespDTO.class);
			dto.setPgPropertyid(review.getPgProperty().getPgId());
			dto.setPgPropertyName(review.getPgProperty().getName());
			dto.setUserid(review.getUser().getUserId());
			dto.setUserName(review.getUser().getName());
			
			return dto;
		}).collect(Collectors.toList());
	}
	
	//GET REVIEW BY PGID
	@Override
	public List<ReviewRespDTO> reviewForPg(Long pgId) {
		PgProperty pgproperty = pgPropertyDao.findByPgId(pgId)
				.orElseThrow(()->new ResourceNotFoundException("PG Not Found!"));
		
		List<Review> reviews = reviewDao.findByPgProperty(pgproperty);
		return reviews.stream().map(review -> {
			ReviewRespDTO dto = modelMapper.map(review, ReviewRespDTO.class);
			dto.setPgPropertyid(review.getPgProperty().getPgId());
			dto.setPgPropertyName(review.getPgProperty().getName());
			dto.setUserid(review.getUser().getUserId());
			dto.setUserName(review.getUser().getName());
			
			return dto;
		}).collect(Collectors.toList());
	}

	//DELETE
	@Override
	public ApiResponse deleteReview(Long reviewId) {
		Review review = reviewDao.findById(reviewId)
				.orElseThrow(() -> new ResourceNotFoundException("Review not found"));
		reviewDao.delete(review);
		return new ApiResponse("Review deleted successfully");
	}

	

}
