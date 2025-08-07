package com.pgverse.service;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import com.pgverse.custom_exceptions.ApiException;
import com.pgverse.custom_exceptions.ResourceNotFoundException;
import com.pgverse.dao.BookingDao;
import com.pgverse.dao.OwnerDao;
import com.pgverse.dao.PgPropertyDao;
import com.pgverse.dao.PgServiceDao;
import com.pgverse.dao.ReviewDao;
import com.pgverse.dao.RoomDao;
import com.pgverse.dao.UserServiceRequestDao;
import com.pgverse.dto.AddServiceDTO;
import com.pgverse.dto.AddedServiceResponseDTO;
import com.pgverse.dto.ApiResponse;
import com.pgverse.dto.BookingRespDTO;
import com.pgverse.dto.ChangePasswordDTO;
import com.pgverse.dto.LoginReqDTO;
import com.pgverse.dto.OwnerRespDto;
import com.pgverse.dto.PgPropertyReqDTO;
import com.pgverse.dto.PgPropertyRespDTO;
import com.pgverse.dto.RequestedServiceResponseDTO;
import com.pgverse.dto.ReviewRespDTO;
import com.pgverse.dto.RoomReqDTO;
import com.pgverse.dto.RoomRespDTO;
import com.pgverse.dto.UpdateUserDTO;
import com.pgverse.entities.Booking;
import com.pgverse.entities.BookingStatus;
import com.pgverse.entities.Owner;
import com.pgverse.entities.PgProperty;
import com.pgverse.entities.PgService;
import com.pgverse.entities.PgType;
import com.pgverse.entities.Review;
import com.pgverse.entities.Room;
import com.pgverse.entities.RoomStatus;
import com.pgverse.entities.Status;
import com.pgverse.entities.UserServiceRequest;

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
    private final PgServiceDao pgserviceDao;
    private final UserServiceRequestDao userServiceRequestDao;
    private final ReviewDao reviewDao;
    
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
//		@Override
//		public PgPropertyRespDTO addPgProperty(PgPropertyReqDTO dto, MultipartFile imageFile, Long ownerId)
//		        throws IOException {
//
//		    String uploadDir = "uploads/images/pg_property/";
//		    File dir = new File(uploadDir);
//		    if (!dir.exists()) dir.mkdirs();
//		    
//		    String original = imageFile.getOriginalFilename();
//		    String cleanedName = original.replaceAll("[^a-zA-Z0-9\\.\\-_]", "_");
//		    String fileName = UUID.randomUUID().toString() + "_" + cleanedName;
//
////		    String fileName = UUID.randomUUID().toString() + "_" + imageFile.getOriginalFilename();
////		    Path filePath = Paths.get(uploadDir + fileName);
////		    Files.write(filePath, imageFile.getBytes());
//		    
//		    Path filePath = Paths.get(uploadDir + fileName);
//		    Files.write(filePath, imageFile.getBytes());
//
//		    Owner owner = ownerDao.findByOwnerId(ownerId)
//		            .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));
//
//		    PgProperty pg = modelMapper.map(dto, PgProperty.class);
//		    pg.setStatus(Status.AVAILABLE);
//		    pg.setPgType(PgType.GIRLS);
//		    pg.setOwner(owner);
//		    
////		    pg.setImagePath(uploadDir + fileName);
//		    pg.setImagePath("uploads/images/pg_property/" + fileName);  
//
//		    
//		    PgProperty savedPg = pgPropertyDao.save(pg);
//
//		   
//		    PgPropertyRespDTO res = modelMapper.map(savedPg, PgPropertyRespDTO.class);
//		    res.setOwnerid(owner.getOwnerId());
//		    res.setOwnername(owner.getName());
//
//		    return res;
//		}
	
	
	
	@Override
	public PgPropertyRespDTO addPgProperty(PgPropertyReqDTO dto, MultipartFile imageFile, Long ownerId) throws IOException {

	    String uploadDir = System.getProperty("user.dir") + "/uploads/images/pg_property/";
	    File dir = new File(uploadDir);
	    if (!dir.exists()) dir.mkdirs();

	    String original = imageFile.getOriginalFilename();
	    String cleanedName = original.replaceAll("[^a-zA-Z0-9\\.\\-_]", "_");
	    String fileName = UUID.randomUUID().toString() + "_" + cleanedName;

	    Path filePath = Paths.get(uploadDir, fileName);
	    Files.write(filePath, imageFile.getBytes());

	    Owner owner = ownerDao.findByOwnerId(ownerId)
	            .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

	    PgProperty pg = modelMapper.map(dto, PgProperty.class);
	    pg.setStatus(Status.AVAILABLE);
	    pg.setPgType(PgType.GIRLS);
	    pg.setOwner(owner);

	    // Store relative path for URL access
	    pg.setImagePath("uploads/images/pg_property/" + fileName);

	    PgProperty savedPg = pgPropertyDao.save(pg);

	    PgPropertyRespDTO res = modelMapper.map(savedPg, PgPropertyRespDTO.class);
	    res.setOwnerid(owner.getOwnerId());
	    res.setOwnername(owner.getName());

	    return res;
	}

	
	//UPDATE PROPERTY
//	@Override
//	public PgPropertyRespDTO updatePgProperty(Long id,MultipartFile imageFile, PgPropertyReqDTO dto) {
//		
//		PgProperty pgproperty = pgPropertyDao.findByPgId(id)
//				.orElseThrow(()->new ResourceNotFoundException("PG Not Found!"));
//		
//		//Image handling
//		 if (imageFile != null && !imageFile.isEmpty()) {
//		        try {
//		            // Delete the old image file if it exists
//		            String oldImagePath = pgproperty.getImagePath();
//		            if (oldImagePath != null) {
//		                File oldFile = new File(oldImagePath);
//		                if (oldFile.exists()) oldFile.delete();
//		            }
//
//		            // Clean file name to remove spaces/special chars
//		            String original = imageFile.getOriginalFilename();
//		            String cleanedName = original.replaceAll("[^a-zA-Z0-9\\.\\-_]", "_");
//		            String fileName = UUID.randomUUID().toString() + "_" + cleanedName;
//
//		            
//		            // Save new image
//		            String uploadDir = "uploads/images/pg_property/";
//		            File dir = new File(uploadDir);
//		            if (!dir.exists()) dir.mkdirs();
//
//		            //String fileName = UUID.randomUUID().toString() + "_" + imageFile.getOriginalFilename();
//		            Path filePath = Paths.get(uploadDir + fileName);
//		            Files.write(filePath, imageFile.getBytes());
//
//		            // Update image path in entity
//		            pgproperty.setImagePath("uploads/images/pg_property/" + fileName);
//		            
//		        } catch (IOException e) {
//		        	e.printStackTrace();
//		            throw new RuntimeException("Failed to update image", e);
//		        }
//		 }
//		
//		modelMapper.map(dto,pgproperty);
//		PgProperty updated =  pgPropertyDao.save(pgproperty);
//		
//		PgPropertyRespDTO res = modelMapper.map(updated, PgPropertyRespDTO.class);
//		res.setOwnerid(updated.getOwner().getOwnerId());
//		res.setOwnername(updated.getOwner().getName());
//		
//		return res;
//	}
	
	
	
	@Override
	public PgPropertyRespDTO updatePgProperty(Long id, MultipartFile imageFile, PgPropertyReqDTO dto) {
	    
	    PgProperty pgproperty = pgPropertyDao.findByPgId(id)
	            .orElseThrow(() -> new ResourceNotFoundException("PG Not Found!"));

	    // Image handling
	    if (imageFile != null && !imageFile.isEmpty()) {
	        try {
	            // Delete old image file if it exists
	            String oldImagePath = pgproperty.getImagePath();
	            if (oldImagePath != null) {
	                File oldFile = new File(System.getProperty("user.dir") + "/" + oldImagePath);
	                if (oldFile.exists()) oldFile.delete();
	            }

	            // Clean new file name
	            String original = imageFile.getOriginalFilename();
	            String cleanedName = original.replaceAll("[^a-zA-Z0-9\\.\\-_]", "_");
	            String fileName = UUID.randomUUID().toString() + "_" + cleanedName;

	            // Save new image
	            String uploadDir = System.getProperty("user.dir") + "/uploads/images/pg_property/";
	            File dir = new File(uploadDir);
	            if (!dir.exists()) dir.mkdirs();

	            Path filePath = Paths.get(uploadDir, fileName);
	            Files.write(filePath, imageFile.getBytes());

	            // Update relative path in DB
	            pgproperty.setImagePath("uploads/images/pg_property/" + fileName);

	        } catch (IOException e) {
	            e.printStackTrace();
	            throw new RuntimeException("Failed to update image", e);
	        }
	    }

	    // Update other fields
	    modelMapper.map(dto, pgproperty);
	 // After modelMapper.map(dto, pgproperty);
	    pgproperty.setPgType(dto.getPgtype());
	    PgProperty updated = pgPropertyDao.save(pgproperty);

	    // Prepare response DTO
	    PgPropertyRespDTO res = modelMapper.map(updated, PgPropertyRespDTO.class);
	    res.setOwnerid(updated.getOwner().getOwnerId());
	    res.setOwnername(updated.getOwner().getName());

	    return res;
	}



	//DELTE PROPERTY
	@Override
	public ApiResponse deletePgProperty(Long id) {
//		PgProperty pgproperty = pgPropertyDao.findByPgId(id)
//				.orElseThrow(()->new ResourceNotFoundException("PG Not Found!"));

		PgProperty pgproperty = pgPropertyDao.findById(id)
		        .orElseThrow(() -> new ResourceNotFoundException("PG Not Found!"));

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
	public PgPropertyRespDTO getPropertyById(Long id) {
//		PgProperty pgproperty = pgPropertyDao.findByPgId(pgId)
//				.orElseThrow(()-> new ResourceNotFoundException("Pg not found!"));
		
		PgProperty pgproperty = pgPropertyDao.findById(id)
		        .orElseThrow(() -> new ResourceNotFoundException("PG Not Found!"));

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
		
//		List<PgProperty> pgList = owner.getPg();
//		if(pgList.isEmpty() || pgList == null) {
//			throw new ResourceNotFoundException("No PG properties found for the owner");
//		}
		
		  List<PgProperty> pgList = owner.getPg();
		    if (pgList == null || pgList.isEmpty()) {
		        return new ArrayList<>();
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
//	@Override
//	public RoomRespDTO addRoomToPg(Long pgId,MultipartFile imageFile, @Valid RoomReqDTO roomDto) {
////		PgProperty pg = pgPropertyDao.findByPgId(pgId)
////				.orElseThrow(()-> new ResourceNotFoundException("PG Not Found!"));
//		
//		PgProperty pg = pgPropertyDao.findById(pgId)
//		        .orElseThrow(() -> new ResourceNotFoundException("PG Not Found!"));
//
//		Room room = modelMapper.map(roomDto, Room.class);
//		room.setPgproperty(pg);
//		
//		//Image handling
//		 if (imageFile != null && !imageFile.isEmpty()) {
//		        try {
//		            // Generate a unique file name
//		            //String fileName = UUID.randomUUID().toString() + "_" + imageFile.getOriginalFilename();
//		            //String uploadDir = System.getProperty("user.dir") + "/uploads/images/rooms/";
//		            
//		        	String uploadDir = "D:/cdac/Project/PGVerse_proj/PGVerse/PGVerse/PGVerse/uploads/images/rooms/";
//		        	
//		        	File dir = new File(uploadDir);
//		        	if (!dir.exists()) dir.mkdirs();
//		        	
//		        	String original = imageFile.getOriginalFilename();
//		            String cleanedName = original.replaceAll("[^a-zA-Z0-9\\.\\-_]", "_");
//		            String fileName = UUID.randomUUID().toString() + "_" + cleanedName;
//
////		            String uploadDir = "uploads/images/rooms/";
////		        	File dir = new File(uploadDir);
////		            if (!dir.exists()) dir.mkdirs();
//		            
//
//		            File fileToSave = new File(dir, fileName);
//		            imageFile.transferTo(fileToSave);
////		            File destination = new File(uploadDir + fileName);
////		            imageFile.transferTo(destination);
//
//		            File savedFile = new File(uploadDir, fileName);
//		            imageFile.transferTo(savedFile);
//		            // Set image path to entity
//		            room.setImagePath("uploads/images/rooms/" + fileName);
//
//		        } catch (IOException e) {
//		        	e.printStackTrace();
//		            throw new RuntimeException("Image upload failed!", e);
//		        }
//		    }
//		 
//		Room savedRoom = roomDao.save(room);
//		pg.getRooms().add(savedRoom);
//		
//		pgPropertyDao.save(pg);
//		
//		RoomRespDTO dto = modelMapper.map(savedRoom, RoomRespDTO.class);
//		dto.setPgId(savedRoom.getPgproperty().getPgId());
//		dto.setPgName(savedRoom.getPgproperty().getName());
//		
//		return  dto;
//	}

	
//	@Override
//	public RoomRespDTO addRoomToPg(Long pgId, MultipartFile imageFile, @Valid RoomReqDTO roomDto) {
//	    PgProperty pg = pgPropertyDao.findById(pgId)
//	            .orElseThrow(() -> new ResourceNotFoundException("PG Not Found!"));
//
//	    Room room = modelMapper.map(roomDto, Room.class);
//	    room.setPgproperty(pg);
//
//	    // Image handling
//	    if (imageFile != null && !imageFile.isEmpty()) {
//	        try {
//	            String uploadDir = "D:/cdac/Project/PGVerse_proj/PGVerse/PGVerse/PGVerse/uploads/images/rooms/";
//	            File dir = new File(uploadDir);
//	            if (!dir.exists()) dir.mkdirs();
//
//	            String original = imageFile.getOriginalFilename();
//	            String cleanedName = original.replaceAll("[^a-zA-Z0-9\\.\\-_]", "_");
//	            String fileName = UUID.randomUUID().toString() + "_" + cleanedName;
//
//	            File fileToSave = new File(dir, fileName);
//	            imageFile.transferTo(fileToSave);
//
//	            // Save relative path for access via resource handler
//	            room.setImagePath("uploads/images/rooms/" + fileName);
//
//	        } catch (IOException e) {
//	            e.printStackTrace();
//	            throw new RuntimeException("Image upload failed!", e);
//	        }
//	    }
//
//	    Room savedRoom = roomDao.save(room);
//	    pg.getRooms().add(savedRoom);
//	    pgPropertyDao.save(pg);
//
//	    RoomRespDTO dto = modelMapper.map(savedRoom, RoomRespDTO.class);
//	    dto.setPgId(savedRoom.getPgproperty().getPgId());
//	    dto.setPgName(savedRoom.getPgproperty().getName());
//
//	    return dto;
//	}

	
	@Override
	public RoomRespDTO addRoomToPg(Long pgId, MultipartFile imageFile, @Valid RoomReqDTO roomDto) {
	    PgProperty pg = pgPropertyDao.findById(pgId)
	            .orElseThrow(() -> new ResourceNotFoundException("PG Not Found!"));

	    Room room = modelMapper.map(roomDto, Room.class);
	    room.setPgproperty(pg);

	    // Image handling
	    if (imageFile != null && !imageFile.isEmpty()) {
	        try {
	            // Build dynamic upload directory using project root
	            String uploadDir = System.getProperty("user.dir") + "/uploads/images/rooms/";
	            File dir = new File(uploadDir);
	            if (!dir.exists()) dir.mkdirs();

	            // Clean filename and generate unique name
	            String original = imageFile.getOriginalFilename();
	            String cleanedName = original.replaceAll("[^a-zA-Z0-9\\.\\-_]", "_");
	            String fileName = UUID.randomUUID().toString() + "_" + cleanedName;

	            // Save image
	            File fileToSave = new File(dir, fileName);
	            imageFile.transferTo(fileToSave);

	            // Store relative path for frontend use
	            room.setImagePath("uploads/images/rooms/" + fileName);

	        } catch (IOException e) {
	            e.printStackTrace();
	            throw new RuntimeException("Image upload failed!", e);
	        }
	    }

	    Room savedRoom = roomDao.save(room);
	    pg.getRooms().add(savedRoom);
	    pgPropertyDao.save(pg);

	    RoomRespDTO dto = modelMapper.map(savedRoom, RoomRespDTO.class);
	    dto.setPgId(savedRoom.getPgproperty().getPgId());
	    dto.setPgName(savedRoom.getPgproperty().getName());

	    return dto;
	}


	//UPDATE ROOM BY ROOMID
//	@Override
//	public RoomRespDTO updateRoom(Long roomId, MultipartFile imageFile, RoomReqDTO roomDto) {
//		
//		Room room = roomDao.findByRoomId(roomId)
//				.orElseThrow(()-> new ResourceNotFoundException("Room not Found!"));
//		
//		modelMapper.map(roomDto, room);
//		
//		if (imageFile != null && !imageFile.isEmpty()) {
//		    try {
//		       
//		        String oldImagePath = room.getImagePath();
//		        if (oldImagePath != null) {
//	                File oldFile = new File(System.getProperty("user.dir") + "/uploads/images/rooms/" + oldImagePath);
//	                if (oldFile.exists()) oldFile.delete();
//	            }
//
//		        String original = imageFile.getOriginalFilename();
//	            String cleanedName = original.replaceAll("[^a-zA-Z0-9\\.\\-_]", "_");
//	            String fileName = UUID.randomUUID().toString() + "_" + cleanedName;
//
//		        
//		        //String uploadDir = System.getProperty("user.dir") + "/uploads/images/rooms/";
//	            String uploadDir = "uploads/images/rooms/";
//	            File dir = new File(uploadDir);
//	            if (!dir.exists()) dir.mkdirs();
//
//		        
//	            //String fileName = UUID.randomUUID().toString() + "_" + imageFile.getOriginalFilename();
//	            Path filePath = Paths.get(uploadDir, fileName);
//	            Files.write(filePath, imageFile.getBytes());
//
//		    
//		        room.setImagePath("uploads/images/rooms/" + fileName);
//
//		    } catch (IOException e) {
//		        throw new RuntimeException("Failed to update room image", e);
//		    }
//		}
//
//		Room updatedRoom = roomDao.save(room);
//		
//		RoomRespDTO dto = modelMapper.map(updatedRoom, RoomRespDTO.class);
//		dto.setPgId(updatedRoom.getPgproperty().getPgId());
//		dto.setPgName(updatedRoom.getPgproperty().getName());
//		
//		return dto;
//	}

	
	@Override
	public RoomRespDTO updateRoom(Long roomId, MultipartFile imageFile, RoomReqDTO roomDto) {

	    Room room = roomDao.findByRoomId(roomId)
	            .orElseThrow(() -> new ResourceNotFoundException("Room not Found!"));

	    modelMapper.map(roomDto, room);

	    if (imageFile != null && !imageFile.isEmpty()) {
	        try {
	            // Delete old image if exists
	            String oldImagePath = room.getImagePath();
	            if (oldImagePath != null && !oldImagePath.isBlank()) {
	                File oldFile = new File(System.getProperty("user.dir") + "/" + oldImagePath);
	                if (oldFile.exists()) oldFile.delete();
	            }

	            // Clean and generate new file name
	            String original = imageFile.getOriginalFilename();
	            String cleanedName = original.replaceAll("[^a-zA-Z0-9\\.\\-_]", "_");
	            String fileName = UUID.randomUUID().toString() + "_" + cleanedName;

	            // Create directory and save new image
	            String uploadDir = System.getProperty("user.dir") + "/uploads/images/rooms/";
	            File dir = new File(uploadDir);
	            if (!dir.exists()) dir.mkdirs();

	            Path filePath = Paths.get(uploadDir, fileName);
	            Files.write(filePath, imageFile.getBytes());

	            // Store relative path in DB
	            room.setImagePath("uploads/images/rooms/" + fileName);

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
//	    PgProperty pgProp = pgPropertyDao.findByPgId(pgId)
//	            .orElseThrow(() -> new ResourceNotFoundException("PG Property not found"));

		PgProperty pgProp = pgPropertyDao.findById(pgId)
		        .orElseThrow(() -> new ResourceNotFoundException("PG Not Found!"));

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

	
	//----------PGPROPERTY-----------
	
	
	@Override
	public AddedServiceResponseDTO addService(Long ownerId,AddServiceDTO dto) {
		
		Room room = roomDao.findById(dto.getRoomId())
	            .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

		 PgProperty pgProperty = room.getPgproperty();
		
		 // Check if the PG's owner matches the current owner
		    if (!pgProperty.getOwner().getOwnerId().equals(ownerId)) {
		        throw new ApiException("You are not authorized to add services to this PG");
		    }
		    
		 PgService pgservice = modelMapper.map(dto, PgService.class);
		 
		 pgservice.setRoom(room);
		 
		 PgService savedService = pgserviceDao.save(pgservice);
		 
		 AddedServiceResponseDTO responseDTO = new AddedServiceResponseDTO();

		 
		 
		 responseDTO.setServiceId(savedService.getServiceId());
		 responseDTO.setServiceName(savedService.getName());
		 responseDTO.setServiceDescription(savedService.getDescription());
		 responseDTO.setServicePrice(savedService.getPrice());
		 responseDTO.setPgId(pgProperty.getPgId());
		 responseDTO.setPgName(pgProperty.getName());
		
		responseDTO.setRoomId(room.getRoomId());
		
		return responseDTO;
	}

	//--------SERVICES----------
	
	@Override
	public List<RequestedServiceResponseDTO> getRequestedServicesById(Long pgId) {
		PgProperty pgProperty = pgPropertyDao.findById(pgId)
		        .orElseThrow(() -> new ResourceNotFoundException("PG Property not found"));

		
		System.out.println("PG ID: " + pgId);
		System.out.println("PG Property found: " + pgProperty.getName());
		List<UserServiceRequest> requests = userServiceRequestDao.findByPgProperty(pgProperty);
	    if (requests.isEmpty()) {
	        throw new ResourceNotFoundException("No service requests found for this PG");
	    }

	    return requests.stream()
	        .map(req -> {
	            RequestedServiceResponseDTO dto = new RequestedServiceResponseDTO();
	            dto.setUserId(req.getUser().getUserId());
	            dto.setUserName(req.getUser().getName());

	            dto.setServiceId(req.getService().getServiceId());
	            dto.setServiceName(req.getService().getName());
	            dto.setServiceDescription(req.getService().getDescription());
	            dto.setServicePrice(req.getService().getPrice());

	            dto.setPgId(pgProperty.getPgId());
	            dto.setPgName(pgProperty.getName());
	            
	            dto.setRoomId(req.getService().getRoom().getRoomId());

	            return dto;
	        })
	        .collect(Collectors.toList());
	}

	
	@Override
	public List<AddedServiceResponseDTO> getServicesById(Long pgId) {
		
		    PgProperty pgProperty = pgPropertyDao.findByPgId(pgId)
		        .orElseThrow(() -> new ResourceNotFoundException("PG Property not found with ID: " + pgId));

		    List<PgService> services = pgserviceDao.findServicesByPgId(pgId);
		    
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
		        
		        

		        // If service linked to room, set roomId; else null
		        if (ser.getRoom() != null) {
		            dto.setRoomId(ser.getRoom().getRoomId());
		        }

		        return dto;
		    }).collect(Collectors.toList());

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
	
	
	//--------BOOKINGS----------
	
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
}
