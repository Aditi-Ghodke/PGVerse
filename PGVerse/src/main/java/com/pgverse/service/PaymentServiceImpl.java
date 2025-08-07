package com.pgverse.service;

import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.pgverse.custom_exceptions.ApiException;
import com.pgverse.custom_exceptions.ResourceNotFoundException;
import com.pgverse.dao.BookingDao;
import com.pgverse.dao.PgPropertyDao;
import com.pgverse.dao.RoomDao;
import com.pgverse.dto.BookingReqDTO;
import com.pgverse.entities.PgProperty;
import com.pgverse.entities.Room;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class PaymentServiceImpl {

	@Autowired
	private BookingDao bookingDao;
	
	@Value("${razorpay.key_id}")
	private String RAZORPAY_KEY;
	
	@Value("${razorpay.key_secret}")
	private String RAZORPAY_SECRET;
	
	@Autowired
	private  RoomDao roomDao;
	
	@Autowired
	private PgPropertyDao pgPropertyDao;
	
	public Map<String, Object> processRazorpayOrder(BookingReqDTO dto) {
	    try {
	        Room room = roomDao.findById(dto.getRoomId())
	                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

	        PgProperty pgProperty = pgPropertyDao.findByPgId(dto.getPgId())
	                .orElseThrow(() -> new ResourceNotFoundException("PG not found"));

	        // Calculate user's share
//	        double expectedAmount = room.getPricePerMonth() / room.getCapacity();
//	        expectedAmount = Math.round(expectedAmount * 100.0) / 100.0;
//	        
//	        // Create order on Razorpay
//	        Order order = createRazorpayOrder(expectedAmount);
	        
	        double expectedAmount = room.getPricePerMonth() / room.getCapacity();
	        expectedAmount = Math.round(expectedAmount * 100.0) / 100.0;

	        // Convert to paise (integer) for Razorpay
	        int amountInPaise = (int) Math.round(expectedAmount);
	        
	        Order order = createRazorpayOrder(amountInPaise);

	        // ✅ Prepare response
	        JSONObject response = new JSONObject();
	        response.put("orderId", order.get("id").toString());
	        response.put("amount", Integer.parseInt(order.get("amount").toString()));
	        response.put("currency", order.get("currency").toString());
	        response.put("key", RAZORPAY_KEY);

	        return response.toMap();

	    } catch (RazorpayException e) {
	        throw new ApiException("Failed to create Razorpay order. Please try again.");
	    }
	}

	
	
	private Order createRazorpayOrder(double amount) throws RazorpayException {
		RazorpayClient razorpayClient = new RazorpayClient(RAZORPAY_KEY, RAZORPAY_SECRET);

		JSONObject options = new JSONObject();
		options.put("amount", (int) (amount * 100));
		options.put("currency", "INR");
		options.put("receipt", "txn_" + System.currentTimeMillis());
		options.put("payment_capture", 1);

		return razorpayClient.orders.create(options);
	}

}
