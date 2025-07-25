package com.pgverse.service;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.pgverse.custom_exceptions.ApiException;
import com.pgverse.custom_exceptions.ResourceNotFoundException;
import com.pgverse.dao.BookingDao;
import com.pgverse.dao.OwnerDao;
import com.pgverse.dao.PgPropertyDao;
import com.pgverse.dao.RoomDao;
import com.pgverse.dto.ApiResponse;
import com.pgverse.dto.BookingRespDTO;
import com.pgverse.dto.ChangePasswordDTO;
import com.pgverse.dto.LoginReqDTO;
import com.pgverse.dto.OwnerRespDto;
import com.pgverse.dto.PgPropertyReqDTO;
import com.pgverse.dto.PgPropertyRespDTO;
import com.pgverse.dto.RoomReqDTO;
import com.pgverse.dto.RoomRespDTO;
import com.pgverse.dto.UpdateUserDTO;
import com.pgverse.entities.Booking;
import com.pgverse.entities.Owner;
import com.pgverse.entities.PgProperty;
import com.pgverse.entities.PgType;
import com.pgverse.entities.Room;
import com.pgverse.entities.Status;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class OwnerServiceImpl implements OwnerService{

    private final BCryptPasswordEncoder passwordEncoder;
    private final OwnerDao ownerDao;
    private final ModelMapper modelMapper;
    private final PgPropertyDao pgPropertyDao;
    private final RoomDao roomDao;
    private final BookingDao bookingDao;
    
  //----------OWNERS-----------
    
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
	public OwnerRespDto updateOwner(Long id, UpdateUserDTO dto) {
		Owner owner = ownerDao.findByOwnerId(id)
				.orElseThrow(()->new ResourceNotFoundException("Owner Not Found!"));
		modelMapper.map(dto,owner);
		ownerDao.save(owner);
		
		return modelMapper.map(owner, OwnerRespDto.class);
	}
	
	
	//----------PGPROPERTY-----------
	
	
	//ADD PGPROPERTY
		@Override
		public PgPropertyRespDTO addPgProperty(PgPropertyReqDTO dto, MultipartFile imageFile, Long ownerId)
		        throws IOException {

		    String uploadDir = "uploads/images/pg_property/";
		    File dir = new File(uploadDir);
		    if (!dir.exists()) dir.mkdirs();

		    String fileName = UUID.randomUUID().toString() + "_" + imageFile.getOriginalFilename();
		    Path filePath = Paths.get(uploadDir + fileName);
		    Files.write(filePath, imageFile.getBytes());

		    Owner owner = ownerDao.findByOwnerId(ownerId)
		            .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

		    PgProperty pg = modelMapper.map(dto, PgProperty.class);
		    pg.setStatus(Status.AVAILABLE);
		    pg.setPgType(PgType.GIRLS);
		    pg.setOwner(owner);
		    
		    pg.setImagePath(uploadDir + fileName);

		    
		    PgProperty savedPg = pgPropertyDao.save(pg);

		   
		    PgPropertyRespDTO res = modelMapper.map(savedPg, PgPropertyRespDTO.class);
		    res.setOwnerid(owner.getOwnerId());
		    res.setOwnername(owner.getName());

		    return res;
		}
	
	//UPDATE PROPERTY
	@Override
	public PgPropertyRespDTO updatePgProperty(Long id,MultipartFile imageFile, PgPropertyReqDTO dto) {
		
		PgProperty pgproperty = pgPropertyDao.findByPgId(id)
				.orElseThrow(()->new ResourceNotFoundException("PG Not Found!"));
		
		//Image handling
		 if (imageFile != null && !imageFile.isEmpty()) {
		        try {
		            // Delete the old image file if it exists
		            String oldImagePath = pgproperty.getImagePath();
		            if (oldImagePath != null) {
		                File oldFile = new File(oldImagePath);
		                if (oldFile.exists()) oldFile.delete();
		            }

		            // Save new image
		            String uploadDir = "uploads/images/";
		            File dir = new File(uploadDir);
		            if (!dir.exists()) dir.mkdirs();

		            String fileName = UUID.randomUUID().toString() + "_" + imageFile.getOriginalFilename();
		            Path filePath = Paths.get(uploadDir + fileName);
		            Files.write(filePath, imageFile.getBytes());

		            // Update image path in entity
		            pgproperty.setImagePath(uploadDir + fileName);

		        } catch (IOException e) {
		            throw new RuntimeException("Failed to update image", e);
		        }
		 }
		
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
		
		//delete image
		   if (pgproperty.getImagePath() != null) {
			   //System.getProperty gives root folder
		        String imagePath = System.getProperty("user.dir") + "/uploads/" + pgproperty.getImagePath();
		        File imageFile = new File(imagePath);
		        if (imageFile.exists()) {
		            boolean deleted = imageFile.delete();
		            System.out.println("Image deleted: " + deleted);
		        }
		    }
		   
		pgPropertyDao.delete(pgproperty);
		return new ApiResponse("PG Deleted Successfully!");
	}

	//GET PGPROPERTYBYID
	@Override
	public PgPropertyRespDTO getPropertyById(Long pgId) {
		PgProperty pgproperty = pgPropertyDao.findByPgId(pgId)
				.orElseThrow(()-> new ResourceNotFoundException("Pg not found!"));
		PgPropertyRespDTO pgpropertydto = modelMapper.map(pgproperty, PgPropertyRespDTO.class);
		pgpropertydto.setOwnerid(pgproperty.getOwner().getOwnerId());
		pgpropertydto.setOwnername(pgproperty.getOwner().getName());
		return pgpropertydto;
	}
	
	//GET PGPROPERTY BY OWNER ID
	@Override
	public List<PgPropertyRespDTO> getPgByOwnerId(Long ownerId) {
		Owner owner =  ownerDao.findByOwnerId(ownerId)
				.orElseThrow(() -> new ResourceNotFoundException("Owner not found"));
		
		List<PgProperty> pgList = owner.getPg();
		if(pgList.isEmpty() || pgList == null) {
			throw new ResourceNotFoundException("No PG properties found for the owner");
		}
		return owner.getPg().stream().map( pg->{
			PgPropertyRespDTO dto = modelMapper.map(pg, PgPropertyRespDTO.class);
			
			dto.setOwnerid(owner.getOwnerId());
			dto.setOwnername(owner.getName());
			dto.setImagePath(pg.getImagePath());
			return dto;
		}).collect(Collectors.toList());
		
	
	}
	
	//----------ROOMS-----------

	//ADD ADD ROOM TO PGPROPERTY
	@Override
	public RoomRespDTO addRoomToPg(Long pgId,MultipartFile imageFile, @Valid RoomReqDTO roomDto) {
		PgProperty pg = pgPropertyDao.findByPgId(pgId)
				.orElseThrow(()-> new ResourceNotFoundException("PG Not Found!"));
		
		Room room = modelMapper.map(roomDto, Room.class);
		room.setPgproperty(pg);
		
		//Image handling
		 if (imageFile != null && !imageFile.isEmpty()) {
		        try {
		            // Generate a unique file name
		            String fileName = UUID.randomUUID().toString() + "_" + imageFile.getOriginalFilename();
		            String uploadDir = System.getProperty("user.dir") + "/uploads/images/rooms/";
		            File dir = new File(uploadDir);
		            if (!dir.exists()) dir.mkdirs();

		            File destination = new File(uploadDir + fileName);
		            imageFile.transferTo(destination);

		            // Set image path to entity
		            room.setImagePath(fileName);
		        } catch (IOException e) {
		            throw new RuntimeException("Image upload failed!", e);
		        }
		    }
		 
		Room savedRoom = roomDao.save(room);
		pg.getRooms().add(savedRoom);
		
		pgPropertyDao.save(pg);
		
		RoomRespDTO dto = modelMapper.map(savedRoom, RoomRespDTO.class);
		dto.setPgId(savedRoom.getPgproperty().getPgId());
		dto.setPgName(savedRoom.getPgproperty().getName());
		
		return  dto;
	}


	//UPDATE ROOM BY ROOMID
	@Override
	public RoomRespDTO updateRoom(Long roomId, MultipartFile imageFile, RoomReqDTO roomDto) {
		
		Room room = roomDao.findByRoomId(roomId)
				.orElseThrow(()-> new ResourceNotFoundException("Room not Found!"));
		
		modelMapper.map(roomDto, room);
		
		if (imageFile != null && !imageFile.isEmpty()) {
		    try {
		       
		        String oldImagePath = room.getImagePath();
		        if (oldImagePath != null) {
		            File oldFile = new File(oldImagePath);
		            if (oldFile.exists()) oldFile.delete();
		        }

		       
		        String uploadDir = "uploads/rooms/";
		        File dir = new File(uploadDir);
		        if (!dir.exists()) dir.mkdirs();

		        
		        String fileName = UUID.randomUUID().toString() + "_" + imageFile.getOriginalFilename();
		        Path filePath = Paths.get(uploadDir + fileName);
		        Files.write(filePath, imageFile.getBytes());

		    
		        room.setImagePath(uploadDir + fileName);

		    } catch (IOException e) {
		        throw new RuntimeException("Failed to update room image", e);
		    }
		}

		Room updatedRoom = roomDao.save(room);
		
		RoomRespDTO dto = modelMapper.map(updatedRoom, RoomRespDTO.class);
		dto.setPgId(updatedRoom.getPgproperty().getPgId());
		dto.setPgName(updatedRoom.getPgproperty().getName());
		
		return dto;
	}


	//DELETE ROOM BY ROOM ID
	@Override
	public ApiResponse deleteRoom(Long roomId) {
		Room room = roomDao.findByRoomId(roomId)
				.orElseThrow(()-> new ResourceNotFoundException("Room not Found!"));
		
		roomDao.delete(room);
		
		return new ApiResponse("Room deleted successfully!");
	}


	//GET ALL ROOMS BY PGID
	@Override
	public List<RoomRespDTO> getAllRooms(Long pgId) {
	    PgProperty pgProp = pgPropertyDao.findByPgId(pgId)
	            .orElseThrow(() -> new ResourceNotFoundException("PG Property not found"));

	    List<Room> rooms = pgProp.getRooms();
	    if(rooms == null || rooms.isEmpty()) {
	    	throw new ResourceNotFoundException("Rooms not found");
	    }
	    return pgProp.getRooms().stream().map(room -> {
	        RoomRespDTO dto = modelMapper.map(room, RoomRespDTO.class);

	        dto.setPgId(pgProp.getPgId());
	        dto.setPgName(pgProp.getName());
	        dto.setImagePath(pgProp.getImagePath()); 

	        return dto;
	    }).collect(Collectors.toList());
	}

	//GET ROOM BY ROOM ID
	@Override
	public RoomRespDTO getRoomById(Long roomId) {
		Room room = roomDao.findByRoomId(roomId)
				.orElseThrow(() -> new ResourceNotFoundException("Room not found"));
		RoomRespDTO dto = modelMapper.map(room, RoomRespDTO.class);
		dto.setPgId(room.getPgproperty().getPgId());
		dto.setPgName(room.getPgproperty().getName());
		dto.setImagePath(room.getImagePath());
		return dto;
	}

	//----------BOOKINGS-----------
	
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
}
