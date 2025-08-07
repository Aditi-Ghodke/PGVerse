import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { addReview,   createRazorpayOrder, makeBooking, makePayment  } from "../api/userApi"; 
import { getPgById, getRoomsByPgId, getReviewsByPgId } from "../api/pgpropertyApi";


const PgDetailsPage = () => {
  const { pgId } = useParams();
  const navigate = useNavigate();
  const { pgPropertId } = useParams();

  const [pg, setPg] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState("");
  const isLoggedIn = !!localStorage.getItem("token");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const location = useLocation();
  
// Load PG details, rooms, and reviews
useEffect(() => {
  getPgById(pgId).then(res => setPg(res.data));
  getRoomsByPgId(pgId).then(res => setRooms(res.data.rooms || []));
  getReviewsByPgId(pgId).then(res => setReviews(res.data));
}, [pgId]);

// Restore booking details from sessionStorage after rooms are loaded
useEffect(() => {
  const saved = sessionStorage.getItem("bookingDetails");
  if (saved && rooms.length > 0) {
    const parsed = JSON.parse(saved);
    setCheckInDate(parsed.checkInDate);
    setCheckOutDate(parsed.checkOutDate);
    setBookingDate(parsed.checkInDate); // optional if you're using this

    const matchedRoom = rooms.find(r => r.roomId === parsed.roomId);
    if (matchedRoom) setSelectedRoom(matchedRoom);
  }
}, [rooms]);

 // Automatically save booking details to sessionStorage
  useEffect(() => {
    if (selectedRoom && checkInDate && checkOutDate) {
      const bookingDetails = {
        checkInDate,
        checkOutDate,
        roomId: selectedRoom.roomId,
        pgId: selectedRoom.pgId
      };
      sessionStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));
    }
  }, [checkInDate, checkOutDate, selectedRoom]);

const handleRoomSelect = (room) => {
  setSelectedRoom(room);

  // Only save if dates are present
  if (checkInDate && checkOutDate) {
    const bookingDetails = {
      checkInDate,
      checkOutDate,
      roomId: room.roomId,
      pgId: room.pgId,
    };
    sessionStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));
    console.log("Booking saved:", bookingDetails);
  }
};


const handleBookNow = async () => {
  if (!selectedRoom || !checkInDate || !checkOutDate) {
    alert("Please select a room and both check-in/check-out dates.");
    return;
  }

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");

  if (!token || !userId) {
    navigate("/login", {
        state: { from: location },
      });
  }

  if (!pgId) {
    alert("PG ID is missing.");
    return;
  }

  try {
    const userShare = selectedRoom.pricePerMonth / selectedRoom.capacity;

    const bookingPayload = {
      userId: Number(userId),
      roomId: selectedRoom.roomId,
      pgId: pgId,
      checkInDate,
      checkOutDate,
      status: "BOOKED",
    };

    console.log("Creating Razorpay order with:", bookingPayload);
    const { orderId, amount, currency, key } = await createRazorpayOrder(bookingPayload, token);
    console.log("Razorpay order amount (paise):", amount);
    const options = {
      key,
      amount,
      currency,
      name: "PG Room Booking",
      description: "Booking payment",
      order_id: orderId,
      handler: async function (response) {
        try {
          const bookingData = {
            userId: Number(userId),
            roomId: selectedRoom.roomId,
            pgId: pgId,
            checkInDate,
            checkOutDate,
            status: "BOOKED",
          };

          const bookingRes = await makeBooking(bookingData, token);
          console.log("Booking saved:", bookingRes);

          const bookingId = bookingRes?.data?.bookingId || bookingRes?.bookingId;

          if (!bookingId) {
            alert("Failed to create booking.");
            return;
          }

          const paymentData = {
            //amount: selectedRoom.pricePerMonth,
             amount: userShare,
            paymentStatus: "SUCCESS",
          };
          
          await makePayment(bookingId, paymentData, token);

          alert("Booking and payment successful!");
          navigate("/");
        } catch (err) {
          console.error("Error in booking or payment:", err);
          alert("Something went wrong during booking/payment.");
        }
      },
      theme: {
        color: "#0f9d58",
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response) {
      console.error("Payment failed:", response.error);
      alert("Payment failed. Please try again.");
    });

    rzp.open();

  } catch (error) {
    console.error("Razorpay order creation failed", error);
    alert("Something went wrong. Please try again.");
  }
};


    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
};



const submitReview = () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  if (!token || !userId) {
    alert("Please login first to leave a review.");
    navigate("/login");
    return;
  }

  if (!reviewRating || !reviewComment) {
    alert("Please fill out both rating and comment");
    return;
  }

  const data = {
    rating: reviewRating,
    comment: reviewComment,
  };

  addReview(pgId, userId, data, token)
    .then(() => {
      alert("Review submitted!");
      setReviewComment("");
      setReviewRating("");
      return getReviewsByPgId(pgId);
    })
    .then(res => setReviews(res.data))
    .catch(err => {
      const msg = err?.response?.data?.message;

      if (msg === "You cannot review this PG unless you have a booking.") {
        alert("You cannot leave a review unless you have booked this PG.");
      } else if (msg === "You have already reviewed this pg.") {
        alert("You have already submitted a review for this PG.");
      } else {
        alert("Failed to submit review. Please try again.");
      }

      console.error("Review error:", err);
    });
};



  if (!pg) return <p>Loading PG details...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{pg.name}</h1>
      <p className="mb-2">{pg.location} | {pg.pgType} | {pg.status}</p>
      <p className="mb-6">{pg.description}</p>
      <img
        src={`http://localhost:8080/${pg.imagePath}`} 
        alt={pg.name}
        className="w-full max-h-96 object-cover mb-6 rounded"
      />

      <h2 className="text-2xl font-semibold mb-4">Rooms</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {rooms.map((room, index) => (
        <div
          key={room.roomId ?? `room-${index}`}
          className={`border p-4 rounded cursor-pointer ${
            selectedRoom?.roomId === room.roomId ? "border-blue-500 shadow" : "border-gray-300"
          }`}
          onClick={() => handleRoomSelect(room)}
        >
          <img
            src={`http://localhost:8080/${room.imagePath}`}
            alt={`Room ${room.roomNumber || room.roomId}`}
            className="w-full h-40 object-cover rounded mb-2"
          />
          <p>PGId: {room.pgId}</p>
          <p>Room ID: {room.roomId}</p>
          <p>Floor: {room.floor}</p>
          <p>Capacity: {room.capacity}</p>
          <p>Price: ₹{room.pricePerMonth}</p>
          <p>Status: {room.status}</p>
        </div>
      ))}
    </div>

    {/* Selected Room Info & Booking Dates */}
    {selectedRoom && (
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h3 className="text-xl font-semibold mb-2">Selected Room Details</h3>
        <p><strong>Room ID:</strong> {selectedRoom.roomId}</p>
        <p><strong>Price:</strong> ₹{selectedRoom.pricePerMonth}</p>
        <p><strong>Pg:</strong> ₹{selectedRoom.pgId}</p>
        <div className="mt-4">
          <label className="block mb-1 font-medium" htmlFor="checkInDate">Check-In Date:</label>
          <input
            type="date"
            id="checkInDate"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            className="border rounded px-3 py-2 w-full max-w-xs"
            min={new Date().toISOString().split("T")[0]} // prevent past dates
          />
        </div>

        <div className="mt-4">
          <label className="block mb-1 font-medium" htmlFor="checkOutDate">Check-Out Date:</label>
          <input
            type="date"
            id="checkOutDate"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            className="border rounded px-3 py-2 w-full max-w-xs"
            min={checkInDate || new Date().toISOString().split("T")[0]} // checkOutDate can't be before checkInDate
          />
        </div>
      </div>
    )}
      <button
        onClick={handleBookNow}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
      >
        Book Now
      </button>

      <h2 className="text-2xl font-semibold mt-10 mb-4">Reviews</h2>
      {reviews.length === 0 && <p>No reviews yet.</p>}
      {reviews.map(review => (
        <div
          key={review.reviewId ?? `${review.userName}-${review.feedbackDate}`}
          className="border p-4 rounded mb-4"
        >
          <p className="font-semibold">⭐ {review.rating} by {review.userName}</p>
          <p>{review.comment}</p>
          {/* <p className="text-sm text-gray-500">{new Date(review.feedbackDate).toLocaleDateString()}</p> */}
           <p className="text-xs text-gray-400">Date: {formatDate(review.feedbackDate)}</p>
        </div>
      ))}

      {isLoggedIn && (
        <div className="mt-10 border p-4 rounded">
          <h3 className="text-xl font-bold mb-2">Leave a Review</h3>
          <textarea
            rows={4}
            placeholder="Write your feedback..."
            className="w-full border p-2 rounded mb-2"
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
          />
          <input
            type="number"
            min={1}
            max={5}
            placeholder="Rating (1-5)"
            className="w-full border p-2 rounded mb-2"
            value={reviewRating}
            onChange={(e) => setReviewRating(e.target.value)}
          />
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => {
              const token = localStorage.getItem("token");
              const userId = localStorage.getItem("userId");

              if (!token || !userId) {
                alert("Please login first to leave a review.");
                navigate("/login");
                return;
              }

              submitReview();
            }}
          >
            Submit Review
          </button>

        </div>
      )}
      
    </div>
  );
};

export default PgDetailsPage;