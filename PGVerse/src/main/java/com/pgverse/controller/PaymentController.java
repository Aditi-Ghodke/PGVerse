//package com.pgverse.controller;
//
//public class PaymentController {
//
//}

package com.pgverse.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pgverse.dto.BookingReqDTO;
import com.pgverse.dto.BookingRespDTO;
import com.pgverse.dto.PaymentReqDTO;
import com.pgverse.service.PaymentServiceImpl;
import com.pgverse.service.UserService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/payment")
@AllArgsConstructor
public class PaymentController {

	private PaymentServiceImpl razorpayService;

	private UserService userService;
	@PostMapping("/create-order")
	public ResponseEntity<?> createOrder(@RequestBody BookingReqDTO dto) {
		return ResponseEntity.ok(razorpayService.processRazorpayOrder(dto));
	}
	
	@PostMapping("/make-payment/{bookingId}")
    public ResponseEntity<BookingRespDTO> makePaymentForBooking(
            @PathVariable Long bookingId,
            @RequestBody PaymentReqDTO paymentDTO) {

        BookingRespDTO bookingResp = userService.makePayment(bookingId, paymentDTO);
        return ResponseEntity.ok(bookingResp);
    }
}