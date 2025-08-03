import React, { useEffect, useState } from "react";
import { getUserById, 
  changePassword,
  updateUser,
  getReviewsByUser,
  getBookingsByUser,
  addReview,
  updateReview,
  deleteReview
} from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";

const UserDashboard = ({ view }) => {
  const [user, setUser] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");

  const [reviews, setReviews] = useState([]);
  const [reviewError, setReviewError] = useState(null);

  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [feedbackDate, setFeedbackDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedPgId, setSelectedPgId] = useState("");

  const [viewType, setViewType] = useState("view");
  const [existingReviewId, setExistingReviewId] = useState(null);



  useEffect(() => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");
   if (!token || !userId) return;

  getUserById(userId, token)
    .then((res) => setUser(res.data))
    .catch((err) => console.error("Failed to fetch user:", err));
  
  if (view === "updateUser") {
    getUserById(userId, token)
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Failed to fetch user:", err));
  }

  if (view === "getBookings") {
    getBookingsByUser(userId, token)
      .then((res) => setBookings(res.data))
      .catch((err) => setBookingError("Failed to fetch bookings"));
  }

  if (view === "getUserReviews") {
    getReviewsByUser(userId, token)
      .then((res) => setReviews(res.data))
      .catch((err) => setReviewError("Failed to fetch reviews"));
  }
}, [view]);


  const handleChangePassword = async (e) => {
  e.preventDefault();
  const email = user?.email || localStorage.getItem("email");

  if (!oldPassword || !newPassword) {
    setMessage("Please fill all the fields.");
    return;
  }
  if (oldPassword === newPassword) {
    setMessage("Old password and new password cannot be the same.");
    return;
  }

  setLoading(true);
  setMessage(null);

  try {
    await changePassword(
      { email, oldPassword, newPassword },
      localStorage.getItem("token")
    );
    setMessage("Password changed successfully!");
    setOldPassword("");
    setNewPassword("");
  } catch (error) {
    setMessage(
      error.response?.data?.message || "Failed to change password."
    );
  } finally {
    setLoading(false);
  }
};

// UPDATE USER
const handleUpdateUser = async (e) => {
  e.preventDefault();

  if (!name || !address || !phone) {
    setMessage("Please fill all the fields.");
    return;
  }

  setLoading(true);
  setMessage(null);

  try {
    await updateUser(userId, { name, address, phone }, token);
    setMessage("User updated successfully!");
    const updatedUser = await getUserById(userId, token);
    setUser(updatedUser.data);
  } catch (error) {
    setMessage(error.response?.data?.message || "Failed to update user.");
  } finally {
    setLoading(false);
  }
};



//GET ALL REVIEWS
useEffect(() => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  if (view === "getUserReviews" && userId && token) {
    getReviewsByUser(userId, token)
      .then((res) => {
        setReviews(res.data);
        console.log(reviews);
        setReviewError(null);
      })
      .catch((err) => {
        setReviewError(err.response?.data?.message || "Failed to fetch reviews");
      });
  }
}, [view]);

//GET ALL BOOKINGS
const [bookings, setBookings] = useState([]);
const [bookingError, setBookingError] = useState("");

useEffect(() => {
  const fetchBookings = async () => {
    if (view === "getBookings") {
      const userId = localStorage.getItem("id");
      const token = localStorage.getItem("token");
      console.log("userId from localStorage:", userId);
      try {
        const response = await getBookingsByUser(userId, token);
        setBookings(response.data);
      } catch (error) {
        setBookingError(
          error.response?.data?.message || "Failed to fetch bookings"
        );
      }
    }
  };

  fetchBookings();
}, [view]);


useEffect(() => {
  if (userId && token) {
    getBookingsByUser(userId, token)
      .then(res => setBookings(res.data))
      .catch(err => setBookingError("Failed to load bookings"));
  }
}, [userId, token]);

const handleCancelBooking = async (bookingId) => {
  if (!window.confirm("Are you sure you want to cancel this booking?")) return;

  try {
    await cancelBooking(userId, bookingId, token);
    setMessage("Booking cancelled successfully!");
    // Refresh bookings after cancel
    const res = await getBookingsByUser(userId, token);
    setBookings(res.data);
  } catch (error) {
    setMessage(error.response?.data?.message || "Failed to cancel booking.");
  }
};

//ADD REVIEW
const uniquePgs = Array.from(
  new Map(
    bookings.map((b) => [b.pgPropertId, { pgId: b.pgPropertId, pgName: b.pgPropertyName }])
  ).values()
);

// console.log("Bookings:", bookings);
// console.log("uniquePgs:", uniquePgs);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!comment.trim()) {
    setMessage("Comment cannot be empty.");
    return;
  }

  if (!selectedPgId) {
    setMessage("Please select a PG to review.");
    return;
  }
  setLoading(true);
  setMessage(null);
  try {
    const pgIdNum = Number(selectedPgId);

    if (isNaN(pgIdNum)) {
      setMessage("Invalid PG selected.");
      setLoading(false);
      return;
    }
     if (existingReviewId) {
      await updateReview(
        existingReviewId,
        {
          rating,
          comment,
          feedbackDate,
        },
        token
      );
      setMessage("Review updated successfully!");
    } else {
      //Add Review
      await addReview(
        pgIdNum,
        userId,
        {
          rating,
          comment,
          feedbackDate,
        },
        token
      );
      setMessage("Review added successfully!");
    }
    setRating(1);
    setComment("");
    setSelectedPgId("");
    setFeedbackDate(new Date().toISOString().split("T")[0]);
    setExistingReviewId(null);  // Reset edit mode
    setViewType("getUserReviews"); // Switch back to review list
  } catch (error) {
    console.error("Add Review Error:", error);
    setMessage(error.response?.data?.message || "Failed to submit review.");
  } finally {
    setLoading(false);
  }
};

//UPDATE, DELETE REVIEW

const [reviewData, setReviewData] = useState({
  pgId: "",
  rating: "",
  comment: ""
});

const handleEditReview = (r) => {
  console.log("Editing review:", r.reviewId); 

  setReviewData({
    pgId: r.pgPropertId, 
    rating: r.rating,
    comment: r.comment
  });
  setExistingReviewId(r.reviewId);
  console.log("existingid",existingReviewId );
  setViewType("addReview"); 
};
//DELETE
const handleDeleteReview = async (reviewId) => {
  console.log("Attempting to delete review with ID:", reviewId); 

  if (!reviewId) {
    console.error("Invalid reviewId:", reviewId);
    return;
  }

  if (window.confirm("Are you sure you want to delete this review?")) {
    try {
      await deleteReview(reviewId, token);
      console.log("Review deleted:", reviewId); 
      setReviews((prev) => prev.filter((r) => r.reviewId !== reviewId));
    } catch (error) {
      console.error("Failed to delete review:", error);
      alert("Failed to delete review.");
    }
  }
};

  if (!user) return <p className="p-4 text-gray-600">Loading user data...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h1>

      {view === "getUser" && (
        <div className="bg-white shadow-md rounded-lg p-4 space-y-2 mb-6">
          <p>
            <strong>User ID:</strong> {user.userId}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone:</strong> {user.phone}
          </p>
          <p>
            <strong>Gender:</strong> {user.gender}
          </p>
          <p>
            <strong>Address:</strong> {user.address}
          </p>
          <p>
            <strong>Card:</strong> {user.card}
          </p>
          <p>
            <strong>Role:</strong> {user.role?.name}
          </p>
        </div>
      )}

      {view === "changePassword" && (
    <form
      onSubmit={handleChangePassword}
      className="max-w-md bg-white p-6 rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4">Change Password</h2>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Email</label>
        <input
          type="email"
          value={user.email || ""}
          readOnly
          className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Old Password</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      {message && (
        <p
          className={`mb-4 ${
            message.includes("success") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? "Changing..." : "Change Password"}
      </button>
    </form>
  )}

  {/* UPDATE */}
{view === "updateUser" && (
  <>
    <form
      onSubmit={handleUpdateUser}
      className="max-w-md bg-white p-6 rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4">Update Profile</h2>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Phone</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      {message && (
        <p className={`mb-4 ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? "Updating..." : "Update Profile"}
      </button>
    </form>
  </>
)}

  {/* ADD REVIEW */}
    {view === "addReview" && (
  <form onSubmit={handleSubmit} className="max-w-md bg-white p-6 rounded shadow">
    <h2 className="text-xl font-bold mb-4">Add Review</h2>

    <label className="block mb-1 font-semibold">Select PG</label>
    
    <select
      value={selectedPgId}
      onChange={(e) => setSelectedPgId(e.target.value)}
      className="w-full mb-4 border border-gray-300 rounded px-3 py-2"
      required
    >
      <option value="">-- Select PG --</option>
      {uniquePgs.map((pg, index) => (
        <option key={pg.pgId ?? index} value={pg.pgId ?? "hello"}>
          {pg.pgName || "Unnamed PG"}
        </option>
      ))}
    </select>


    <label className="block mb-1 font-semibold">Rating (1-5)</label>
    <select
      value={rating}
      onChange={(e) => setRating(Number(e.target.value))}
      className="w-full mb-4 border border-gray-300 rounded px-3 py-2"
    >
      {[1, 2, 3, 4, 5].map((r) => (
        <option key={r} value={r}>{r}</option>
      ))}
    </select>

    <label className="block mb-1 font-semibold">Comment</label>
    <textarea
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      required
      rows={4}
      className="w-full mb-4 border border-gray-300 rounded px-3 py-2"
    />

    <label className="block mb-1 font-semibold">Feedback Date</label>
    <input
      type="date"
      max={new Date().toISOString().split("T")[0]}
      value={feedbackDate}
      onChange={(e) => setFeedbackDate(e.target.value)}
      required
      className="w-full mb-4 border border-gray-300 rounded px-3 py-2"
    />

    {message && (
      <p className={`mb-4 ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
        {message}
      </p>
    )}

    <button
      type="submit"
      disabled={loading}
      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
    >
      {loading ? "Submitting..." : "Submit Review"}
    </button>
  </form>
)}

{/* GET ALL REVIEWS */}
  
{view === "getUserReviews" && (
  <div className="p-4 bg-white rounded shadow">
    <h2 className="text-xl font-bold mb-4">Your Reviews</h2>

    {reviewError && <p className="text-red-500 mb-4">{reviewError}</p>}

    {reviews.length === 0 ? (
      <p className="text-gray-600">No reviews found.</p>
    ) : (
      <ul className="space-y-4">
        {reviews.map((review) => (
      
          <li
            key={review.reviewId}
            className="border p-4 rounded bg-gray-50 shadow-sm"
          >
            
            <p><strong>PG:</strong> {review.pgPropertyName}</p>
            <p><strong>Rating:</strong> {review.rating}</p>
            <p><strong>Comment:</strong> {review.comment}</p>
            <p><strong>Date:</strong> {new Date(review.feedbackDate).toLocaleDateString()}</p>

            <div className="flex gap-3 mt-3">
              <button
                type="button"
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => {
                  console.log("Edit clicked for reviewId:", review.reviewId);
                   handleEditReview(review); 
                }}
              >
                Update
              </button>

              <button
                type="button"
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => {
                  console.log("Delete clicked for reviewId:", review.reviewId);
                  if (window.confirm("Are you sure you want to delete this review?")) {
                    handleDeleteReview(review.reviewId);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
)}

{/* CANCEL BOOKING */}

{view === "getBookings" && (
  <div>
    <h2 className="text-2xl font-bold mb-4">Your Bookings</h2>

    {bookingError && <p className="text-red-600 mb-4">{bookingError}</p>}
    {message && (
      <p className={`mb-4 ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
        {message}
      </p>
    )}

    {bookings.length === 0 ? (
      <p>No bookings found.</p>
    ) : (
      <table className="w-full table-auto border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">PG Name</th>
            <th className="px-4 py-2 border">Room ID</th>
            <th className="px-4 py-2 border">Booking Date</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Check-in Date</th>
            <th className="px-4 py-2 border">Check-out Date</th>
            <th className="px-4 py-2 border">Payment Status</th>
            <th className="px-4 py-2 border">Amount</th>
            <th className="px-4 py-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.bookingId}>
              <td className="px-4 py-2 border">{booking.pgPropertyName}</td>
              <td className="px-4 py-2 border">{booking.roomId}</td>
              <td className="px-4 py-2 border">{booking.bookingDate}</td>
              <td className="px-4 py-2 border">{booking.status}</td>
              <td className="px-4 py-2 border">{booking.checkInDate}</td>
              <td className="px-4 py-2 border">{booking.checkOutDate}</td>
              <td className="px-4 py-2 border">{booking.paymentStatus}</td>
              <td className="px-4 py-2 border">₹{booking.amount}</td>
              <td className="px-4 py-2 border">
                {booking.status !== "Cancelled" && (
                  <button
                    onClick={() => handleCancelBooking(booking.bookingId)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    Cancel
                  </button>
                )}
                {booking.status === "Cancelled" && <span className="text-gray-500">Cancelled</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
)}
</div>
  );
};

export default UserDashboard;