package com.pgverse.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pgverse.custom_exceptions.ApiException;
import com.pgverse.custom_exceptions.ResourceNotFoundException;
import com.pgverse.dao.AdminDao;
import com.pgverse.dao.BookingDao;
import com.pgverse.dao.OwnerDao;
import com.pgverse.dao.PgPropertyDao;
import com.pgverse.dao.ReviewDao;
import com.pgverse.dao.UserDao;
import com.pgverse.dto.AdminRespDTO;
import com.pgverse.dto.ApiResponse;
import com.pgverse.dto.BookingRespDTO;
import com.pgverse.dto.LoginReqDTO;
import com.pgverse.dto.OwnerReqDto;
import com.pgverse.dto.OwnerRespDto;
import com.pgverse.dto.PgPropertyRespDTO;
import com.pgverse.dto.ReviewRespDTO;
import com.pgverse.dto.UserRespDto;
import com.pgverse.entities.Admin;
import com.pgverse.entities.Booking;
import com.pgverse.entities.Owner;
import com.pgverse.entities.PgProperty;
import com.pgverse.entities.Review;
import com.pgverse.entities.Role;
import com.pgverse.entities.User;

import lombok.AllArgsConstructor;
@Service

@Transactional
@AllArgsConstructor
public class AdminServiceImpl implements AdminService{
	
	private final AdminDao adminDao;
	private final BCryptPasswordEncoder passwordEncoder;
	private final UserDao userDao;
	private final ModelMapper modelMapper;
	private final OwnerDao ownerDao;
	private final PgPropertyDao pgPropertyDao;
	private final ReviewDao reviewDao;
	private final BookingDao bookingDao;
	
	//----------ADMIN--------
	
	//ADMIN LOGIN
	@Override
	public AdminRespDTO adminLogin(LoginReqDTO dto) {
	 Admin admin = adminDao.findByEmail(dto.getEmail())
				.orElseThrow(() -> new ApiException("User not found"));
	 if(!dto.getPassword().equals(admin.getPassword())) {
		 throw new ApiException("Incorrect credentials");
	 }
	 AdminRespDTO admindto = modelMapper.map(admin, AdminRespDTO.class);
	 //admindto.setId(admin.getAdminId());
	 return admindto;
	}
	
	//----------USERS-----------
	
	//GET ALL USERS
	@Override
	public List<UserRespDto> getAllUsers() {
		List<User> users = userDao.findAll();
		
		if(users.isEmpty()) {
			throw new ResourceNotFoundException("No tenants found.");
		}
		return users.stream()
		        .map(user -> {
		            UserRespDto dto = modelMapper.map(user, UserRespDto.class);
		            return dto;
		        })
		        .collect(Collectors.toList());
	}

	//GET USERS BY ID
	@Override
	public UserRespDto getUserById(Long userId) {
		return userDao.findByUserId(userId)
		        .map(user -> {
		            UserRespDto dto = modelMapper.map(user, UserRespDto.class);
		           
		            return dto;
		        })
		        .orElseThrow(() -> new ApiException("Tenant Not Found!"));
	}

	//----------OWNERS-----------
	
	//ADD OWNER
	@Override
	public OwnerRespDto addOwner(OwnerReqDto dto) {
		if (ownerDao.findByEmail(dto.getEmail()).isPresent()) {
	        throw new ApiException("Email already registered!");
	    }
		
		Owner owner = modelMapper.map(dto, Owner.class);
		owner.setPassword(passwordEncoder.encode(dto.getPassword()));
		owner.setRole(Role.OWNER);
		return modelMapper.map(ownerDao.save(owner),OwnerRespDto.class);
		
	}

	//GET ALL OWNERS
	@Override
	public List<OwnerRespDto> getAllOwners() {
		
		List<Owner> owners = ownerDao.findAll();

	    if (owners.isEmpty()) {
	        throw new ResourceNotFoundException("No owners found.");
	    }
	    return owners.stream()
	    		.map(owner->modelMapper.map(owner, OwnerRespDto.class))
	    		.collect(Collectors.toList());
	}

	//GET OWNER BY ID
	@Override
	public OwnerRespDto getOwnerById(Long ownerId) {
		return ownerDao.findByOwnerId(ownerId)
				.map(owner->modelMapper.map(owner, OwnerRespDto.class))
				.orElseThrow(()->new ApiException("Owner Not Found!"));
	}

	//DELETE OWNER
	@Override
	public ApiResponse deleteOwner(Long ownerId) {
		Owner owner = ownerDao.findByOwnerId(ownerId)
				.orElseThrow(()->new ResourceNotFoundException("Owner Not Found!"));
		ownerDao.delete(owner);
		return new ApiResponse("Owner Deleted Successfully!");	
	}

	//--------REVIEW----------
	
	@Override
	public List<ReviewRespDTO> reviewForPg(Long pgId) {
		PgProperty pgproperty = pgPropertyDao.findByPgId(pgId)
				.orElseThrow(()->new ResourceNotFoundException("PG Not Found!"));
		
		List<Review> reviews = reviewDao.findByPgProperty(pgproperty);
		return reviews.stream().map(review -> {
			ReviewRespDTO dto = modelMapper.map(review, ReviewRespDTO.class);
			dto.setPgPropertyid(review.getPgProperty().getPgId());
			dto.setPgPropertyName(review.getPgProperty().getName());
			//dto.setUserid(review.getUser().getUserId());
			dto.setUserName(review.getUser().getName());
			
			return dto;
		}).collect(Collectors.toList());
	}

	@Override
	public List<PgPropertyRespDTO> getAllPgProperty() {
	    List<PgProperty> properties = pgPropertyDao.findAll();

	    if (properties.isEmpty()) {
	        throw new ResourceNotFoundException("No PG properties found.");
	    }

	    return properties.stream()
	            .map(pg -> {
	                PgPropertyRespDTO dto = modelMapper.map(pg, PgPropertyRespDTO.class);
	                dto.setOwnerid(pg.getOwner().getOwnerId());
	                dto.setOwnername(pg.getOwner().getName());
	                return dto;
	            })
	            .collect(Collectors.toList());
	}

	@Override
	public List<BookingRespDTO> getBookingsByPgId(Long pgId) {
		PgProperty pgProperty = pgPropertyDao.findByPgId(pgId)
				.orElseThrow(() -> new ResourceNotFoundException("PG not found"));
		List<Booking> bookings = bookingDao.findByRoom_Pgproperty_PgId(pgId);

	    if (bookings.isEmpty()) {
	        throw new ResourceNotFoundException("No bookings found for this PG");
	    }

	    return bookings.stream().map(booking -> {
	        BookingRespDTO dto = modelMapper.map(booking, BookingRespDTO.class);

	        // Set Room and PGProperty
	        if (booking.getRoom() != null) {
		        dto.setRoomId(booking.getRoom().getRoomId());
		        dto.setRoomId(booking.getRoom().getRoomId());

		        if (booking.getRoom().getPgproperty() != null) {
		            dto.setPgPropertId(booking.getRoom().getPgproperty().getPgId());
		            dto.setPgPropertyName(booking.getRoom().getPgproperty().getName());
		        }
		    }

	        // Set User
	        if (booking.getUser() != null) {
	            dto.setUserId(booking.getUser().getUserId());
	            dto.setUserName(booking.getUser().getName());
	        }

	        // Set Payment
	        if (booking.getPayment() != null) {
	            dto.setPaymentId(booking.getPayment().getPaymentId());
	            dto.setAmount(booking.getPayment().getAmount());
	            dto.setPaymentStatus(booking.getPayment().getPaymentStatus());
	            dto.setPaymentDate(booking.getPayment().getPaymentDate());
	        }

	        return dto;
	    }).collect(Collectors.toList());
	}

	@Override
	public BookingRespDTO getBookingsByBookingId(Long bookingId) {
	    Booking booking = bookingDao.findById(bookingId)
	        .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));    

	    BookingRespDTO dto = modelMapper.map(booking, BookingRespDTO.class);

	    // Set additional nested fields manually
	    if (booking.getRoom() != null) {
	        dto.setRoomId(booking.getRoom().getRoomId());
	        dto.setRoomId(booking.getRoom().getRoomId());

	        if (booking.getRoom().getPgproperty() != null) {
	            dto.setPgPropertId(booking.getRoom().getPgproperty().getPgId());
	            dto.setPgPropertyName(booking.getRoom().getPgproperty().getName());
	        }
	    }

	    if (booking.getUser() != null) {
	        dto.setUserId(booking.getUser().getUserId());
	        dto.setUserName(booking.getUser().getName());
	    }

	    if (booking.getPayment() != null) {
	        dto.setPaymentId(booking.getPayment().getPaymentId());
	        dto.setAmount(booking.getPayment().getAmount());
	        dto.setPaymentStatus(booking.getPayment().getPaymentStatus());
	        dto.setPaymentDate(booking.getPayment().getPaymentDate());
	    }

	    return dto;
	}

//	public BookingRespDTO getBookingsByBookingId(Long bookingId) {
//		    Booking booking = bookingDao.findById(bookingId)
//		        .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));    
//		    return modelMapper.map(booking, BookingRespDTO.class);
//	}

	
}
