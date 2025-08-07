package com.pgverse.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pgverse.custom_exceptions.ApiException;
import com.pgverse.custom_exceptions.ResourceNotFoundException;
import com.pgverse.dao.BookingDao;
import com.pgverse.dao.PaymentDao;
import com.pgverse.dao.PgPropertyDao;
import com.pgverse.dao.PgServiceDao;
import com.pgverse.dao.ReviewDao;
import com.pgverse.dao.RoomDao;
import com.pgverse.dao.UserDao;
import com.pgverse.dao.UserServiceRequestDao;
import com.pgverse.dto.AddBookingResDTO;
import com.pgverse.dto.AddedServiceResponseDTO;
import com.pgverse.dto.ApiResponse;
import com.pgverse.dto.BookingReqDTO;
import com.pgverse.dto.BookingRespDTO;
import com.pgverse.dto.ChangePasswordDTO;
import com.pgverse.dto.LoginReqDTO;
import com.pgverse.dto.PaymentReqDTO;
import com.pgverse.dto.RequestServiceDTO;
import com.pgverse.dto.RequestedServiceResponseDTO;
import com.pgverse.dto.ReviewReqDTO;
import com.pgverse.dto.ReviewRespDTO;
import com.pgverse.dto.UpdateUserDTO;
import com.pgverse.dto.UserReqDto;
import com.pgverse.dto.UserRespDto;
import com.pgverse.entities.Booking;
import com.pgverse.entities.BookingStatus;
import com.pgverse.entities.Payment;
import com.pgverse.entities.PaymentStatus;
import com.pgverse.entities.PgProperty;
import com.pgverse.entities.PgService;
import com.pgverse.entities.Review;
import com.pgverse.entities.Role;
import com.pgverse.entities.Room;
import com.pgverse.entities.RoomStatus;
import com.pgverse.entities.ServiceStatus;
import com.pgverse.entities.User;
import com.pgverse.entities.UserServiceRequest;


import lombok.AllArgsConstructor;
import java.time.LocalDate;


@Service
@Transactional
@AllArgsConstructor
public class UserServiceImpl implements UserService{

    private final BCryptPasswordEncoder passwordEncoder;
	private final UserDao userDao;
	private final ModelMapper modelMapper;
	private final PgPropertyDao pgPropertyDao;
	private final ReviewDao reviewDao;
    private final RoomDao roomDao;
    private final BookingDao bookingDao;
    private final PaymentDao paymentDao;
    private final PgServiceDao serviceDao;
    private UserServiceRequestDao userServiceRequestDao;
//    private final JwtService jwtService;
//    private final AuthenticationManager authenticationManager;
    
    //-----------USER-------------
	
    
    //REGISTER USER
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

	//USER SIGNIN
	@Override
	public UserRespDto loginUser(LoginReqDTO loginDto) {
		User user = userDao.findByEmail(loginDto.getEmail())
				.orElseThrow(()->new ApiException("Invalid email or password"));
		
		 if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
		        throw new ApiException("Invalid email or password");
		 }
		 return modelMapper.map(user, UserRespDto.class);
	}
	
	//CHANGEPASSWORD
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
	
	//GET USER BY USERID
	@Override
	public UserRespDto getUserById(Long userId) {

		return userDao.findByUserId(userId)
				.map(user->modelMapper.map(user, UserRespDto.class))
				.orElseThrow(()->new ApiException("User Not Found!"));
	}

	//UPDATE USER DETAILS
	@Override
	public UserRespDto updateUserDetails(Long userId, UpdateUserDTO dto) {
		
		 User user = userDao.findByUserId(userId)
		            .orElseThrow(() -> new ResourceNotFoundException("User Not Found!"));

		    modelMapper.map(dto, user);

		    userDao.save(user);

		    UserRespDto response = new UserRespDto();
		    response.setName(user.getName());
		    response.setEmail(user.getEmail());
		    response.setPhone(user.getPhone());
		    response.setGender(user.getGender());
		    response.setAddress(user.getAddress());
		    response.setCard(user.getCard());
		    response.setRole(user.getRole());

		    return response;
	}

	//DELETE USER BY USERID
	@Override
	public ApiResponse deleteUser(Long userId) {
		User user = userDao.findByUserId(userId)
				.orElseThrow(()->new ResourceNotFoundException("User Not Found!"));
		userDao.delete(user);
		return new ApiResponse("User Deleted Successfully!");
	}

	
	//-------REVIEW-----------
	
	
	//GIVE REVIEW
	@Override
	public ReviewRespDTO giveReview( ReviewReqDTO dto, Long pgId, Long userId) {
		PgProperty pgproperty = pgPropertyDao.findByPgId(pgId)
				.orElseThrow(()->new ResourceNotFoundException("PG Not Found!"));
		
		User user = userDao.findByUserId(userId)
				.orElseThrow(()->new ResourceNotFoundException("User Not Found!"));
		
		 // Check if user has any booking for this PG
	    boolean hasBooking = bookingDao.existsByUserAndPgProperty(user, pgproperty);
	    if (!hasBooking) {
	        throw new ApiException("You cannot review this PG unless you have a booking.");
	    }
		
		if(reviewDao.existsByUserAndPgProperty(user, pgproperty)) {
			throw new ApiException("You have already reviewed this pg.");
		}
		
		Review review = modelMapper.map(dto, Review.class);
		review.setUser(user);
		review.setPgProperty(pgproperty);
		review.setFeedbackDate(LocalDate.now());

		
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
		//res.setUserid(updated.getUser().getUserId());
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
			//dto.setUserid(review.getUser().getUserId());
			dto.setUserName(review.getUser().getName());
			
			return dto;
		}).collect(Collectors.toList());
	}
	
	//DELETE REVIEW BY REVIEWID
	@Override
	public ApiResponse deleteReview(Long reviewId) {
		Review review = reviewDao.findById(reviewId)
				.orElseThrow(() -> new ResourceNotFoundException("Review not found"));
		reviewDao.delete(review);
		return new ApiResponse("Review deleted successfully");
	}
	
	//---------BOOKING----------
	
	//CREATE BOOKING
	public AddBookingResDTO createBooking(BookingReqDTO dto) {
        User user = userDao.findByUserId(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Room room = roomDao.findById(dto.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        PgProperty pgProperty = pgPropertyDao.findByPgId(dto.getPgId())
                .orElseThrow(() -> new ResourceNotFoundException("PG not found"));
        
        //Check if room belongs to the selected PG
        if (!room.getPgproperty().getPgId().equals(dto.getPgId())) {
            throw new ApiException("Selected room does not belong to the specified PG property");
        }
        LocalDate today = LocalDate.now();
        
        if (dto.getCheckInDate().isBefore(today)) {
            throw new ApiException("Check-in date cannot be in the past");
        }

        if (!dto.getCheckOutDate().isAfter(dto.getCheckInDate())) {
            throw new ApiException("Check-out date must be after check-in date");
        }

        // Check room occupancy limit
        int activeBookings = bookingDao.countActiveBookingsForRoom(
        	    room,
        	    dto.getCheckInDate(),
        	    dto.getCheckOutDate(),
        	    BookingStatus.BOOKED // or CONFIRMED if that's your "active"
        	);
        
        if (activeBookings >= room.getCapacity()) {
            throw new ApiException("Room has reached its maximum occupancy for the selected dates");
        }
        
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setRoom(room);
        booking.setPgProperty(pgProperty);
        booking.setStatus(dto.getStatus() != null ? dto.getStatus() : BookingStatus.CONFIRMED);
        booking.setBookingDate(LocalDate.now());
        booking.setCheckInDate(dto.getCheckInDate());
        booking.setCheckOutDate(dto.getCheckOutDate());

        Booking savedBooking = bookingDao.save(booking);

        int current = bookingDao.countCurrentOccupants(room, LocalDate.now(), BookingStatus.BOOKED);
        room.setCurrentOccupancy(current);

        roomDao.save(room);
        
        roomDao.saveAndFlush(room);
        
        // Map to response DTO
        
        AddBookingResDTO respDto = modelMapper.map(savedBooking, AddBookingResDTO.class);
        respDto.setRoomId(savedBooking.getRoom().getRoomId());
        respDto.setPgPropertId(savedBooking.getPgProperty().getPgId());
        respDto.setPgPropertyName(savedBooking.getPgProperty().getName());
        respDto.setUserId(savedBooking.getUser().getUserId());
        respDto.setUserName(savedBooking.getUser().getName());
        

        return respDto;
        
    }
	
	
	 //MAKE PAYMENT FOR EXISTING BOOKING
//    public BookingRespDTO makePayment(Long bookingId, PaymentReqDTO paymentDTO) {
//        Booking booking = bookingDao.findById(bookingId)
//                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
//
//        if(booking.getPayment() != null) {
//            throw new ApiException("Payment already exists for this booking");
//        }
//        
//        //CHECK PRICE 
//        //USER WILL PAY HIS/HER SHARE ONLY
//       Room room = booking.getRoom();
////        double expectedAmount = room.getPricePerMonth()/room.getCapacity();
////        
//       double expectedAmount = room.getPricePerMonth() / room.getCapacity();
//       expectedAmount = Math.round(expectedAmount* 100.0) / 100.0;
//
//        if(paymentDTO.getAmount()!=expectedAmount) {
//        	throw new ApiException("Invalid payment amount. Expected: " + expectedAmount);
//        }
//        
//        Payment payment = new Payment();
//        payment.setAmount(paymentDTO.getAmount());
//        payment.setPaymentDate(LocalDateTime.now());
//        payment.setPaymentStatus(paymentDTO.getPaymentStatus() != null ? paymentDTO.getPaymentStatus() : PaymentStatus.SUCCESS);
//        payment.setBooking(booking);
//
//        Payment savedPayment = paymentDao.save(payment);
//
//        booking.setPayment(savedPayment);
//        bookingDao.save(booking);
//
//        //Map to BookingRespDTO including payment info
//        BookingRespDTO respDto = modelMapper.map(booking, BookingRespDTO.class);
//        respDto.setRoomId(booking.getRoom().getRoomId());
//        respDto.setPgPropertId(booking.getPgProperty().getPgId());
//        respDto.setPgPropertyName(booking.getPgProperty().getName());
//        respDto.setUserId(booking.getUser().getUserId());
//        respDto.setUserName(booking.getUser().getName());
//
//        //Payment info
//        respDto.setPaymentId(savedPayment.getPaymentId());
//        respDto.setAmount(savedPayment.getAmount());
//        respDto.setPaymentStatus(savedPayment.getPaymentStatus());
//        respDto.setPaymentDate(savedPayment.getPaymentDate());
//
//        return respDto;
//    }

	//MAKE PAYMENT FOR EXISTING BOOKING
//		public BookingRespDTO makePayment(Long bookingId, PaymentReqDTO paymentDTO) {
//	    Booking booking = bookingDao.findById(bookingId)
//	            .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
//
//	    if (booking.getPayment() != null) {
//	        throw new ApiException("Payment already exists for this booking");
//	    }
//
//	    // Calculate expected amount in rupees (rounded to 2 decimals)
//	    Room room = booking.getRoom();
//	    double expectedAmount = room.getPricePerMonth() / room.getCapacity();
//	    expectedAmount = Math.round(expectedAmount * 100.0) / 100.0;
//
//	    // Convert expectedAmount and payment amount to paise (int)
//	    int expectedAmountInPaise = (int) Math.round(expectedAmount * 100);
//	    int paymentAmountInPaise = (int) Math.round(paymentDTO.getAmount() * 100);
//
//	  
//	    if (paymentAmountInPaise != expectedAmountInPaise) {
//	        throw new ApiException("Invalid payment amount. Expected: " + expectedAmount);
//	    }
//
//	    Payment payment = new Payment();
//	    payment.setAmount(paymentDTO.getAmount());  // Store in rupees as before
//	    payment.setPaymentDate(LocalDateTime.now());
//	    payment.setPaymentStatus(paymentDTO.getPaymentStatus() != null ? paymentDTO.getPaymentStatus() : PaymentStatus.SUCCESS);
//	    payment.setBooking(booking);
//
//	    Payment savedPayment = paymentDao.save(payment);
//
//	    booking.setPayment(savedPayment);
//	    bookingDao.save(booking);
//
//	    // Map to BookingRespDTO including payment info
//	    BookingRespDTO respDto = modelMapper.map(booking, BookingRespDTO.class);
//	    respDto.setRoomId(booking.getRoom().getRoomId());
//	    respDto.setPgPropertId(booking.getPgProperty().getPgId());
//	    respDto.setPgPropertyName(booking.getPgProperty().getName());
//	    respDto.setUserId(booking.getUser().getUserId());
//	    respDto.setUserName(booking.getUser().getName());
//
//	    // Payment info
//	    respDto.setPaymentId(savedPayment.getPaymentId());
//	    respDto.setAmount(savedPayment.getAmount());
//	    respDto.setPaymentStatus(savedPayment.getPaymentStatus());
//	    respDto.setPaymentDate(savedPayment.getPaymentDate());
//
//	    return respDto;
//	}

    
	public BookingRespDTO makePayment(Long bookingId, PaymentReqDTO paymentDTO) {
	    Booking booking = bookingDao.findById(bookingId)
	            .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

	    if (booking.getPayment() != null) {
	        throw new ApiException("Payment already exists for this booking");
	    }

	    // Calculate expected amount in rupees (rounded to 2 decimals)
	    Room room = booking.getRoom();
	    double rawAmount = room.getPricePerMonth() / room.getCapacity();
	    double expectedAmount = Math.round(rawAmount * 100.0) / 100.0;

	    System.out.println("Raw amount in rupees: " + rawAmount);
	    System.out.println("Rounded expected amount: " + expectedAmount);

	    // Convert expectedAmount and payment amount to paise (int)
	    int expectedAmountInPaise = (int) Math.round(expectedAmount * 100);
	    int paymentAmountInPaise = (int) Math.round(paymentDTO.getAmount() * 100);
	    
	    System.out.println("Expected amount in paise: " + expectedAmountInPaise);
	    System.out.println("Payment amount in paise: " + paymentAmountInPaise);

	    // Validate payment amount matches expected amount
	    if (paymentAmountInPaise != expectedAmountInPaise) {
	        throw new ApiException("Invalid payment amount. Expected: " + expectedAmount);
	    }

	    // Create and save payment entity
	    Payment payment = new Payment();
	    payment.setAmount(paymentDTO.getAmount());
	    payment.setPaymentDate(LocalDateTime.now());
	    payment.setPaymentStatus(paymentDTO.getPaymentStatus() != null ? paymentDTO.getPaymentStatus() : PaymentStatus.SUCCESS);
	    payment.setBooking(booking);

	    Payment savedPayment = paymentDao.save(payment);

	    // Link payment to booking and save
	    booking.setPayment(savedPayment);
	    bookingDao.save(booking);

	    // Map to BookingRespDTO including payment info
	    BookingRespDTO respDto = modelMapper.map(booking, BookingRespDTO.class);
	    respDto.setRoomId(booking.getRoom().getRoomId());
	    respDto.setPgPropertId(booking.getPgProperty().getPgId());
	    respDto.setPgPropertyName(booking.getPgProperty().getName());
	    respDto.setUserId(booking.getUser().getUserId());
	    respDto.setUserName(booking.getUser().getName());

	    respDto.setPaymentId(savedPayment.getPaymentId());
	    respDto.setAmount(savedPayment.getAmount());
	    respDto.setPaymentStatus(savedPayment.getPaymentStatus());
	    respDto.setPaymentDate(savedPayment.getPaymentDate());

	    return respDto;
	}

	
	
    //UPDATE COMPLETE BOOKING
    
    @Scheduled(cron = "0 0 1 * * ?") // Runs daily at 1 AM
    public void updateCompletedBookings() {
        LocalDate today = LocalDate.now();

        // Step 1: Mark expired bookings as COMPLETED
        List<Booking> bookingsToComplete = bookingDao.findBookingsToMarkCompleted(today);
        for (Booking booking : bookingsToComplete) {
            booking.setStatus(BookingStatus.COMPLETED);
            bookingDao.save(booking);
        }

        // Step 2: For all affected rooms, update their currentOccupancy based on today
        Set<Room> affectedRooms = bookingsToComplete.stream()
            .map(booking -> booking.getRoom())
            .collect(Collectors.toSet());

        for (Room room : affectedRooms) {
            int currentOccupants = bookingDao.countCurrentOccupants(room, today, BookingStatus.BOOKED);
            room.setCurrentOccupancy(currentOccupants);
            if (currentOccupants == 0) {
                room.setStatus(RoomStatus.AVAILABLE);
            } else {
                room.setStatus(RoomStatus.OCCUPIED);
            }
            roomDao.save(room);
        }
    }

    
    
    
    
  //GET ALL BOOKINGS BY USERID
	@Override
	public List<BookingRespDTO> getBookingsByUserId(Long userId) {
		User user = userDao.findByUserId(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));
		
		List<Booking> bookings = bookingDao.findByUserUserId(userId);
		
		if(bookings.isEmpty()) {
			throw new ResourceNotFoundException("No bookings found for this user");
		}
		
		return bookings.stream().map(booking -> {
			BookingRespDTO dto = modelMapper.map(booking, BookingRespDTO.class);
			
			//SET ROOM AND PGPROPERTY
	        if (booking.getRoom() != null) {
	            dto.setRoomId(booking.getRoom().getRoomId());

	            if (booking.getRoom().getPgproperty() != null) {
	                dto.setPgPropertId(booking.getRoom().getPgproperty().getPgId());
	                dto.setPgPropertyName(booking.getRoom().getPgproperty().getName());
	            }
	        }
	        
	     //SET USER
	        if (booking.getUser() != null) {
	            dto.setUserId(booking.getUser().getUserId());
	            dto.setUserName(booking.getUser().getName());
	        }

	        //SET PAYMENT
	        if (booking.getPayment() != null) {
	            dto.setPaymentId(booking.getPayment().getPaymentId());
	            dto.setAmount(booking.getPayment().getAmount());
	            dto.setPaymentStatus(booking.getPayment().getPaymentStatus());
	            dto.setPaymentDate(booking.getPayment().getPaymentDate());
	        }
	        return dto;
	    }).collect(Collectors.toList());
	}



	//CANCEL BOOKING USING USERID AND BOOKINGID
	@Override
	public BookingRespDTO cancelBookingsByUserId(Long userId, Long bookingId) {
		 User user = userDao.findByUserId(userId)
		            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
		 
		 Booking booking = bookingDao.findById(bookingId)
		            .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

		  
		  if (booking.getStatus() == BookingStatus.CANCELLED) {
		        throw new ApiException("Booking is already cancelled");
		   }
		  
		  
		 
		  
		  booking.setStatus(BookingStatus.CANCELLED);
		  
		  Room room = booking.getRoom();
		  if(room !=null) {
			  room.setStatus(RoomStatus.AVAILABLE);	
			  if(room.getCurrentOccupancy()>0) {
				  room.setCurrentOccupancy(room.getCurrentOccupancy()-1);
			  }
			  roomDao.save(room);
		 }
		    
		  bookingDao.save(booking);
		  
		  BookingRespDTO dto = modelMapper.map(booking, BookingRespDTO.class);
		    dto.setUserId(user.getUserId());
		    dto.setUserName(user.getName());
		    if (booking.getRoom() != null) {
		        dto.setRoomId(booking.getRoom().getRoomId());
		        if (booking.getRoom().getPgproperty() != null) {
		            dto.setPgPropertId(booking.getRoom().getPgproperty().getPgId());
		            dto.setPgPropertyName(booking.getRoom().getPgproperty().getName());
		        }
		    }
		    if (booking.getPayment() != null) {
		        dto.setPaymentId(booking.getPayment().getPaymentId());
		        dto.setAmount(booking.getPayment().getAmount());
		        dto.setPaymentStatus(booking.getPayment().getPaymentStatus());
		        dto.setPaymentDate(booking.getPayment().getPaymentDate());
		    }

		    return dto;
	}

	//GET BOOKING BY BOOKINGID
	@Override
	public BookingRespDTO getBookingById(Long bookingId) {
	    Booking booking = bookingDao.findById(bookingId)
	            .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

	    BookingRespDTO dto = modelMapper.map(booking, BookingRespDTO.class);

	    // Set Room and PGProperty
	    if (booking.getRoom() != null) {
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
	}

	@Override
	public RequestedServiceResponseDTO requestService(RequestServiceDTO dto) {
		
		User user = userDao.findById(dto.getUserId())
	            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

	    PgService service = serviceDao.findById(dto.getServiceId())
	            .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

	    PgProperty pg = pgPropertyDao.findById(dto.getPgId())
	            .orElseThrow(() -> new ResourceNotFoundException("PG Property not found"));
	    
	    Room room = roomDao.findById(dto.getRoomId())
	            .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

	    
	    if (!room.getPgproperty().getPgId().equals(pg.getPgId())) {
	        throw new ApiException("This room does not belong to the specified PG.");
	    }
	    
	 // Check if user has a valid booking for the given room and PG (not cancelled)
	    Optional<Booking> bookingOpt = bookingDao.findByUserUserIdAndRoomRoomIdAndPgPropertyPgIdAndStatusNot(
	        user.getUserId(), room.getRoomId(), pg.getPgId(), BookingStatus.CANCELLED);

	    if (bookingOpt.isEmpty()) {
	        throw new ApiException("User does not have a valid booking for this room and PG.");
	    }
	    

	  UserServiceRequest req = modelMapper.map(dto, UserServiceRequest.class);
	  req.setUser(user);
	  req.setService(service);
	  req.setPgProperty(pg);
	  req.setStatus(ServiceStatus.REQUESTED);
	  req.setRequestDate(LocalDate.now());
	  

	  UserServiceRequest saved  = userServiceRequestDao.save(req);
	  
	  RequestedServiceResponseDTO respDto = modelMapper.map(saved, RequestedServiceResponseDTO.class);
	
	  respDto.setUserId(saved.getUser().getUserId());
	  respDto.setUserName(saved.getUser().getName());
	  
	  respDto.setServiceId(saved.getService().getServiceId());
	  respDto.setServiceName(saved.getService().getName());
	  respDto.setServiceDescription(saved.getService().getDescription());
	  respDto.setServicePrice(saved.getService().getPrice());
	  
	  respDto.setPgId(saved.getPgProperty().getPgId());
	  respDto.setPgName(saved.getPgProperty().getName());
	  
	  respDto.setRoomId(room.getRoomId());
	  
	  return respDto;
	}

	@Override
	public List<AddedServiceResponseDTO> getServicesByRoomId(Long roomId) {
		Room room = roomDao.findById(roomId)
		        .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + roomId));
		List<PgService> services = serviceDao.findByRoom(room);

	    return services.stream().map(ser -> {
	        AddedServiceResponseDTO dto = new AddedServiceResponseDTO();

	        dto.setServiceId(ser.getServiceId());
	        dto.setServiceName(ser.getName());
	        dto.setServiceDescription(ser.getDescription());
	        dto.setServicePrice(ser.getPrice());

	        if (ser.getRoom() != null) {
	            dto.setRoomId(ser.getRoom().getRoomId());
	            if (ser.getRoom().getPgproperty() != null) {
	                dto.setPgId(ser.getRoom().getPgproperty().getPgId());
	                dto.setPgName(ser.getRoom().getPgproperty().getName());
	            }
	        }
	        return dto;
	    }).collect(Collectors.toList());
	}

	@Override
	public List<AddedServiceResponseDTO> getServicesByPgId(Long pgId) {
		 PgProperty pgProperty = pgPropertyDao.findById(pgId)
			        .orElseThrow(() -> new ResourceNotFoundException("PG Property not found with ID: " + pgId));

		List<PgService> services = serviceDao.findServicesByPgId(pgId);
		
		return services.stream().map(ser -> {
	        AddedServiceResponseDTO dto = new AddedServiceResponseDTO();

	        dto.setServiceId(ser.getServiceId());
	        dto.setServiceName(ser.getName());
	        dto.setServiceDescription(ser.getDescription());
	        dto.setServicePrice(ser.getPrice());

	        if (ser.getRoom() != null) {
	            dto.setRoomId(ser.getRoom().getRoomId());
	            if (ser.getRoom().getPgproperty() != null) {
	                dto.setPgId(ser.getRoom().getPgproperty().getPgId());
	                dto.setPgName(ser.getRoom().getPgproperty().getName());
	            }
	        }
	        return dto;
	    }).collect(Collectors.toList());
	}
}
