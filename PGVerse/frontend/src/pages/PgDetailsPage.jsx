// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   getPgById,
//   getRoomsByPgId,
//   getReviewsByPgId,
// } from "../api/pgpropertyApi";

// const PgDetailsPage = () => {
//   const { pgId } = useParams();
//   const navigate = useNavigate();

//   const [pg, setPg] = useState(null);
//   const [rooms, setRooms] = useState([]);
//   const [reviews, setReviews] = useState([]);
//   const [selectedRoom, setSelectedRoom] = useState(null);
//   const [bookingDate, setBookingDate] = useState("");

//   useEffect(() => {
//     getPgById(pgId).then(res => setPg(res.data));
//     getRoomsByPgId(pgId).then(res => setRooms(res.data.rooms || []));
//     getReviewsByPgId(pgId).then(res => setReviews(res.data));
//   }, [pgId]);

//   const handleRoomSelect = (room) => {
//     setSelectedRoom(room);
//   };


//   const handleBookNow = () => {
//   if (!selectedRoom) {
//     alert("Please select a room");
//     return;
//   }

//   if (!bookingDate) {
//     alert("Please select a booking date");
//     return;
//   }

  

//   // Optional: calculate checkout date (1 day later, for example)
//   const checkInDate = bookingDate;
//   const checkOutDate = new Date(new Date(bookingDate).getTime() + 24 * 60 * 60 * 1000)
//     .toISOString().split("T")[0]; // Format as yyyy-MM-dd

//   // Save booking details
//   sessionStorage.setItem("bookingDetails", JSON.stringify({
//     pgId,
//     roomId: selectedRoom.roomId,
//     checkInDate,
//     checkOutDate, // Optional, you can skip this if not needed yet
//   }));

//   const isLoggedIn = localStorage.getItem("token");

//   if (!isLoggedIn) {
//     navigate("/login");
//   } else {
//     navigate("/user/dashboard"); // Or your booking review/confirmation page
//   }
// };


// // const handleBookNow = () => {
// //   if (!selectedRoom) {
// //     alert("Please select a room");
// //     return;
// //   }

// //   if (!bookingDate) {
// //     alert("Please select a booking date");
// //     return;
// //   }

// //   const checkInDate = bookingDate;
// //   const checkOutDate = new Date(new Date(bookingDate).getTime() + 24 * 60 * 60 * 1000)
// //     .toISOString().split("T")[0];

// //   const bookingDetails = {
// //     pgId,
// //     roomId: selectedRoom.roomId,
// //     checkInDate,
// //     checkOutDate,
// //   };

// //   const isLoggedIn = localStorage.getItem("token");

// //   if (!isLoggedIn) {
// //     // Save booking info and redirect path before login
// //     sessionStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));
// //     sessionStorage.setItem("redirectAfterLogin", `/pg/${pgId}`);
// //     navigate("/login");
// //   } else {
// //     sessionStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));
// //     navigate("/user/dashboard");
// //   }
// // };



//   if (!pg) return <p>Loading PG details...</p>;

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-4">{pg.name}</h1>
//       <p className="mb-2">{pg.location} | {pg.pgType} | {pg.status}</p>
//       <p className="mb-6">{pg.description}</p>
//       <img
//         src={`http://localhost:8080/${pg.imagePath}`} 
//         alt={pg.name}
//         className="w-full max-h-96 object-cover mb-6 rounded"
//       />

//       <h2 className="text-2xl font-semibold mb-4">Rooms</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
//          {rooms.map((room, index) => (
//             <div
//               key={room.roomId ?? `room-${index}`}
//               className={`border p-4 rounded cursor-pointer ${
//                 selectedRoom?.roomId === room.roomId ? "border-blue-500 shadow" : "border-gray-300"
//               }`}
//               onClick={() => handleRoomSelect(room)}
//             >
//             <img
//               src={`http://localhost:8080/${room.imagePath}`}
               
//               alt={`Room ${room.roomNumber || room.roomId}`}
//               className="w-full h-40 object-cover rounded mb-2"
//             />
//             <p>Floor: {room.floor}</p>
//             <p>Capacity: {room.capacity}</p>
//             <p>Price: ₹{room.pricePerMonth}</p>
//             <p>Status: {room.status}</p>
//           </div>
//         ))}
//       </div>

//       <div className="mb-6">
//         <label className="block mb-2 font-semibold">Select Booking Date:</label>
//         <input
//           type="date"
//           value={bookingDate}
//           onChange={(e) => setBookingDate(e.target.value)}
//           className="border p-2 rounded w-full max-w-xs"
//         />
//       </div>

//       <button
//         onClick={handleBookNow}
//         className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
//       >
//         Book Now
//       </button>

//       <h2 className="text-2xl font-semibold mt-10 mb-4">Reviews</h2>
//       {reviews.length === 0 && <p>No reviews yet.</p>}
//       {/* {reviews.map((review, idx) => (
//         <div key={idx} className="border p-4 rounded mb-4">
//           <p className="font-semibold">⭐ {review.rating} by {review.userName}</p>
//           <p>{review.comment}</p>
//           <p className="text-sm text-gray-500">{new Date(review.feedbackDate).toLocaleDateString()}</p>
//         </div>
//       ))} */}

//       {reviews.map(review => (
//         <div
//           key={review.reviewId ?? `${review.userName}-${review.feedbackDate}`}
//           className="border p-4 rounded mb-4"
//         >
//           <p className="font-semibold">⭐ {review.rating} by {review.userName}</p>
//           <p>{review.comment}</p>
//           <p className="text-sm text-gray-500">{new Date(review.feedbackDate).toLocaleDateString()}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default PgDetailsPage;









// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { addReview } from "../api/userApi"; 
// import { getPgById, getRoomsByPgId, getReviewsByPgId } from "../api/pgpropertyApi";


// const PgDetailsPage = () => {
//   const { pgId } = useParams();
//   const navigate = useNavigate();

//   const [pg, setPg] = useState(null);
//   const [rooms, setRooms] = useState([]);
//   const [reviews, setReviews] = useState([]);
//   const [selectedRoom, setSelectedRoom] = useState(null);
//   const [bookingDate, setBookingDate] = useState("");
//   const [reviewComment, setReviewComment] = useState("");
//   const [reviewRating, setReviewRating] = useState("");
//   const isLoggedIn = !!localStorage.getItem("token");

//   useEffect(() => {
//     getPgById(pgId).then(res => setPg(res.data));
//     getRoomsByPgId(pgId).then(res => setRooms(res.data.rooms || []));
//     getReviewsByPgId(pgId).then(res => setReviews(res.data));

//     // Restore booking state if redirected back from login
//     const saved = sessionStorage.getItem("bookingDetails");
//     if (saved) {
//       const parsed = JSON.parse(saved);
//       setBookingDate(parsed.checkInDate);
//       const matchedRoom = rooms.find(r => r.roomId === parsed.roomId);
//       if (matchedRoom) setSelectedRoom(matchedRoom);
//     }
//   }, [pgId]);

//   const handleRoomSelect = (room) => {
//     setSelectedRoom(room);
//   };

//   const handleBookNow = () => {
//     if (!selectedRoom) {
//       alert("Please select a room");
//       return;
//     }

//     if (!bookingDate) {
//       alert("Please select a booking date");
//       return;
//     }

//     const checkInDate = bookingDate;
//     const checkOutDate = new Date(new Date(bookingDate).getTime() + 24 * 60 * 60 * 1000)
//       .toISOString().split("T")[0];

//     const bookingDetails = {
//       pgId,
//       roomId: selectedRoom.roomId,
//       checkInDate,
//       checkOutDate,
//     };

//     const token = localStorage.getItem("token");

//     if (!token) {
//       sessionStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));
//       sessionStorage.setItem("redirectAfterLogin", `/pg/${pgId}`);
//       navigate("/login");
//     } else {
//       sessionStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));
//       navigate("/user/dashboard");
//     }
//   };

// const formatDate = (dateString) => {
//   if (!dateString) return "";
//   const date = new Date(dateString);
//   return date.toLocaleDateString("en-IN", {
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//   });
// };


//   const submitReview = () => {
//   if (!reviewRating || !reviewComment) {
//     alert("Please fill out both rating and comment");
//     return;
//   }

//   const token = localStorage.getItem("token");
//   const userId = localStorage.getItem("userId");

//   if (!token || !userId) {
//     alert("Please login again.");
//     navigate("/login");
//     return;
//   }

//   const data = {
//     rating: reviewRating,
//     comment: reviewComment,
//   };

//   addReview(pgId, userId, data, token)
//     .then(() => {
//       alert("Review submitted!");
//       setReviewComment("");
//       setReviewRating("");
//       return getReviewsByPgId(pgId);
//     })
//     .then(res => setReviews(res.data))
//     .catch(err => {
//       console.error("Error submitting review:", err);
//       alert("Failed to submit review. Please try again.");
//     });
// };

//   if (!pg) return <p>Loading PG details...</p>;

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-4">{pg.name}</h1>
//       <p className="mb-2">{pg.location} | {pg.pgType} | {pg.status}</p>
//       <p className="mb-6">{pg.description}</p>
//       <img
//         src={`http://localhost:8080/${pg.imagePath}`} 
//         alt={pg.name}
//         className="w-full max-h-96 object-cover mb-6 rounded"
//       />

//       <h2 className="text-2xl font-semibold mb-4">Rooms</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
//         {rooms.map((room, index) => (
//           <div
//             key={room.roomId ?? `room-${index}`}
//             className={`border p-4 rounded cursor-pointer ${
//               selectedRoom?.roomId === room.roomId ? "border-blue-500 shadow" : "border-gray-300"
//             }`}
//             onClick={() => handleRoomSelect(room)}
//           >
//             <img
//               src={`http://localhost:8080/${room.imagePath}`}
//               alt={`Room ${room.roomNumber || room.roomId}`}
//               className="w-full h-40 object-cover rounded mb-2"
//             />
//             <p>Floor: {room.floor}</p>
//             <p>Capacity: {room.capacity}</p>
//             <p>Price: ₹{room.pricePerMonth}</p>
//             <p>Status: {room.status}</p>
//           </div>
//         ))}
//       </div>

//       <div className="mb-6">
//         <label className="block mb-2 font-semibold">Select Booking Date:</label>
//         <input
//           type="date"
//           value={bookingDate}
//           onChange={(e) => setBookingDate(e.target.value)}
//           className="border p-2 rounded w-full max-w-xs"
//         />
//       </div>

//       <button
//         onClick={handleBookNow}
//         className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
//       >
//         Book Now
//       </button>

//       <h2 className="text-2xl font-semibold mt-10 mb-4">Reviews</h2>
//       {reviews.length === 0 && <p>No reviews yet.</p>}
//       {reviews.map(review => (
//         <div
//           key={review.reviewId ?? `${review.userName}-${review.feedbackDate}`}
//           className="border p-4 rounded mb-4"
//         >
//           <p className="font-semibold">⭐ {review.rating} by {review.userName}</p>
//           <p>{review.comment}</p>
//           {/* <p className="text-sm text-gray-500">{new Date(review.feedbackDate).toLocaleDateString()}</p> */}
//            <p className="text-xs text-gray-400">Date: {formatDate(review.feedbackDate)}</p>
//         </div>
//       ))}

//       {isLoggedIn && (
//         <div className="mt-10 border p-4 rounded">
//           <h3 className="text-xl font-bold mb-2">Leave a Review</h3>
//           <textarea
//             rows={4}
//             placeholder="Write your feedback..."
//             className="w-full border p-2 rounded mb-2"
//             value={reviewComment}
//             onChange={(e) => setReviewComment(e.target.value)}
//           />
//           <input
//             type="number"
//             min={1}
//             max={5}
//             placeholder="Rating (1-5)"
//             className="w-full border p-2 rounded mb-2"
//             value={reviewRating}
//             onChange={(e) => setReviewRating(e.target.value)}
//           />
//           <button
//             className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//             onClick={submitReview}
//           >
//             Submit Review
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PgDetailsPage;





import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addReview } from "../api/userApi"; 
import { getPgById, getRoomsByPgId, getReviewsByPgId } from "../api/pgpropertyApi";


const PgDetailsPage = () => {
  const { pgId } = useParams();
  const navigate = useNavigate();

  const [pg, setPg] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState("");
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    getPgById(pgId).then(res => setPg(res.data));
    getRoomsByPgId(pgId).then(res => setRooms(res.data.rooms || []));
    getReviewsByPgId(pgId).then(res => setReviews(res.data));

    // Restore booking state if redirected back from login
    const saved = sessionStorage.getItem("bookingDetails");
    if (saved) {
      const parsed = JSON.parse(saved);
      setBookingDate(parsed.checkInDate);
      const matchedRoom = rooms.find(r => r.roomId === parsed.roomId);
      if (matchedRoom) setSelectedRoom(matchedRoom);
    }
  }, [pgId]);

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };

  const handleBookNow = () => {
    if (!selectedRoom) {
      alert("Please select a room");
      return;
    }

    if (!bookingDate) {
      alert("Please select a booking date");
      return;
    }

    const checkInDate = bookingDate;
    const checkOutDate = new Date(new Date(bookingDate).getTime() + 24 * 60 * 60 * 1000)
      .toISOString().split("T")[0];

    const bookingDetails = {
      pgId,
      roomId: selectedRoom.roomId,
      checkInDate,
      checkOutDate,
    };

    const token = localStorage.getItem("token");

    if (!token) {
      sessionStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));
      sessionStorage.setItem("redirectAfterLogin", `/pg/${pgId}`);
      navigate("/login");
    } else {
      sessionStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));
      navigate("/user/dashboard");
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


//   const submitReview = () => {
//   if (!reviewRating || !reviewComment) {
//     alert("Please fill out both rating and comment");
//     return;
//   }

//   const token = localStorage.getItem("token");
//   const userId = localStorage.getItem("userId");

//   if (!token || !userId) {
//     alert("Please login again.");
//     navigate("/login");
//     return;
//   }

//   const data = {
//     rating: reviewRating,
//     comment: reviewComment,
//   };

//   addReview(pgId, userId, data, token)
//     .then(() => {
//       alert("Review submitted!");
//       setReviewComment("");
//       setReviewRating("");
//       return getReviewsByPgId(pgId);
//     })
//     .then(res => setReviews(res.data))
//     .catch(err => {
//       console.error("Error submitting review:", err);
//       alert("Failed to submit review. Please try again.");
//     });
// };

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
            <p>Floor: {room.floor}</p>
            <p>Capacity: {room.capacity}</p>
            <p>Price: ₹{room.pricePerMonth}</p>
            <p>Status: {room.status}</p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-semibold">Select Booking Date:</label>
        <input
          type="date"
          value={bookingDate}
          onChange={(e) => setBookingDate(e.target.value)}
          className="border p-2 rounded w-full max-w-xs"
        />
      </div>

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

