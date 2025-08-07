package com.pgverse.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.pgverse.dto.AddServiceDTO;
import com.pgverse.dto.BookingRespDTO;
import com.pgverse.dto.RequestServiceDTO;
import com.pgverse.dto.ChangePasswordDTO;
import com.pgverse.dto.LoginReqDTO;
import com.pgverse.dto.PgPropertyReqDTO;
import com.pgverse.dto.PgPropertyRespDTO;
import com.pgverse.dto.RoomReqDTO;
import com.pgverse.dto.UpdateUserDTO;
import com.pgverse.service.OwnerService;
import com.pgverse.service.PgPropertyService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/owner")
@AllArgsConstructor
@Validated
public class OwnerController {

	public final OwnerService ownerService;
	public final PgPropertyService pgPropertyService;
	
	//--------OWNER---------
	
	//OWNER LOGIN
	@PostMapping("/login")
	public ResponseEntity<?> ownerLogin(@RequestBody LoginReqDTO dto){
		return ResponseEntity.ok(ownerService.ownerLogin(dto));
	}
	
	//GET OWNER BY ID
	@GetMapping("/{id}")
	public ResponseEntity<?> getAllOwnerById(@PathVariable Long id){
		return ResponseEntity.status(HttpStatus.OK)
				.body(ownerService.getAllOwnerById(id));
	}
	
	//CHNAGE PASSWORD
	@PostMapping("/change-password")
	public ResponseEntity<?> changePassword(@RequestBody ChangePasswordDTO dto){
		return ResponseEntity.ok(ownerService.changePassword(dto));
	}
	
	//UPDATE OWNER
	@PutMapping("/{ownerId}")
	public ResponseEntity<?> updateUser(@PathVariable Long ownerId, @RequestBody UpdateUserDTO dto){
		return ResponseEntity.status(HttpStatus.OK)
				.body(ownerService.updateOwner(ownerId,dto));
	}
	
	//--------PGPROPERTY---------
	
	@PostMapping("/pgproperty/{ownerId}")
	public ResponseEntity<?> addPgProperty(
			@Valid  @ModelAttribute PgPropertyReqDTO dto,
	        @RequestPart("imageFile") MultipartFile imageFile,
	        @PathVariable Long ownerId) {
	    try {
	        PgPropertyRespDTO pgPropertyRespDTO = ownerService.addPgProperty(dto, imageFile, ownerId);
	        return new ResponseEntity<>(pgPropertyRespDTO, HttpStatus.CREATED);
	    } catch (Exception e) {
	        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	
	//UPDATE PGPROPERTY
	@PutMapping("/pgproperty/{pgId}")
	public ResponseEntity<?> updatePgProperty(
			@ModelAttribute PgPropertyReqDTO dto,
			@Valid  @RequestPart("imageFile") MultipartFile imageFile,
	        @PathVariable Long pgId){
		return ResponseEntity.status(HttpStatus.OK)
				.body(ownerService.updatePgProperty(pgId,imageFile, dto));
	}
	
	//DELETE PROPERTY
	@DeleteMapping("/pgproperty/{pgId}")
	public ResponseEntity<?> deletePgProperty(@PathVariable Long pgId){
		return ResponseEntity.status(HttpStatus.OK)
				.body(ownerService.deletePgProperty(pgId));
	}
	
	@GetMapping("/pgproperty/{pgId}")
	public ResponseEntity<?> getPropertyById(@PathVariable Long pgId){
		return ResponseEntity.status(HttpStatus.OK)
				.body(ownerService.getPropertyById(pgId));
	}
	
	
	//GET PG BY OWNERID
	@GetMapping("/pgproperty/{ownerId}/owner")
	public ResponseEntity<?> getPgByOwnerId(@PathVariable Long ownerId){
		return ResponseEntity.status(HttpStatus.OK)
				.body(ownerService.getPgByOwnerId(ownerId));
	}
	
	
	//--------ROOMS---------
	
	
	//ADD ROOM PER PG
	@PostMapping("/pgproperty/{pgId}/rooms")
	public ResponseEntity<?> addRoomToPg(
			@PathVariable Long pgId, 
			@Valid @ModelAttribute RoomReqDTO roomDto,
			@RequestPart("imageFile") MultipartFile imageFile)
	{
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(ownerService.addRoomToPg(pgId,imageFile,roomDto));
	}
	
	
	//UPDATE ROOM
	@PutMapping("/rooms/{roomId}")
	public ResponseEntity<?> updateRoom(
			@PathVariable Long roomId,
			@Valid  @ModelAttribute RoomReqDTO roomDto,
	        @RequestPart(value = "imageFile", required = false) MultipartFile imageFile){
		return ResponseEntity.status(HttpStatus.OK)
				.body(ownerService.updateRoom(roomId,imageFile,roomDto));
	}
	
	//DELETE ROOM
	@DeleteMapping("/rooms/{roomId}")
	public ResponseEntity<?> deleteRoom(@PathVariable Long roomId){
		return ResponseEntity.status(HttpStatus.OK)
				.body(ownerService.deleteRoom(roomId));
	}
	
	//GET ALL ROOMS BY PGID
	@GetMapping("/pgproperty/{pgId}/rooms")
	public ResponseEntity<?> getAllRooms(@PathVariable Long pgId){
		return ResponseEntity.status(HttpStatus.OK)
				.body(ownerService.getAllRooms(pgId));
	}
	
	//GET ROOM BY ROOMID
	@GetMapping("/rooms/{roomId}")
	public ResponseEntity<?> getRoomById(@PathVariable Long roomId){
		return ResponseEntity.status(HttpStatus.OK)
				.body(ownerService.getRoomById(roomId));
	}
	
	//GET BOOKINGS BY PGPROERTYID
	@GetMapping("/bookings/{pgId}")
	public ResponseEntity<?> getBookingsByPgId(@PathVariable Long pgId){
		return ResponseEntity.status(HttpStatus.OK)
				.body(ownerService.getBookingsByPgId(pgId));
	}
	
	//--------SERVICES---------
	
	@PostMapping("/services/{ownerId}/add-service")
	public ResponseEntity<?> addService(@PathVariable Long ownerId, @RequestBody @Valid AddServiceDTO  dto) {
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(ownerService.addService(ownerId,dto));
	}
	
	//GET SERVICES BY PG ID
	@GetMapping("/users/services/{pgId}")
	public ResponseEntity<?> getRequestedServicesById(@PathVariable Long pgId){
		return ResponseEntity.status(HttpStatus.OK)
				.body(ownerService.getRequestedServicesById(pgId));
	}
	
	@GetMapping("/services/{pgId}")
	public ResponseEntity<?> getServicesByPgId(@PathVariable Long pgId){
		return ResponseEntity.status(HttpStatus.OK)
				.body(ownerService.getServicesById(pgId));
	}
	
	
	//--------REVIEWS---------
	
	//GET REVIEW BY PGID
		@GetMapping("/pgproperty/{pgId}/reviews")
		public ResponseEntity<?> getReviewByPgId(@PathVariable Long pgId){
			return ResponseEntity.status(HttpStatus.OK)
					.body(ownerService.reviewForPg(pgId));
		}
		
		
	//--------BOOKINGS----------
		
	@GetMapping("/bookings/update-status")
	public ResponseEntity<String> manuallyUpdateBookings() {
		ownerService.updateCompletedBookings();
		   return ResponseEntity.ok("Bookings updated");
	}
	
	
	@GetMapping("/bookings/pgproperty/{pgId}")
    public ResponseEntity<List<BookingRespDTO>> getBookingsByUserId(@PathVariable Long pgId) {
        List<BookingRespDTO> resp = ownerService.getBookingsByPgId(pgId);
        return ResponseEntity.ok(resp);
    }
	
}
