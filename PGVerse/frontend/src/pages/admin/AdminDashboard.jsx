import { useOutletContext } from "react-router-dom";  // to receive context from AdminLayout
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getAllUsers,
  getUserById,
  registerOwner,
  getAllOwners,
  deleteOwnerById,
  getOwnerById,
  getReviewsByPgId,
  getAllPgProperties,
  getBookingById,
  getBookingsByPgId
} from "../../api/adminApi";

const AdminDashboard = () => {
  const { token } = useAuth();
  const { view } = useOutletContext();  // get `view` from AdminLayout

  const [users, setUsers] = useState([]);
  const [owners, setOwners] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [pgIdForReview, setPgIdForReview] = useState("");
  const [pgReviews, setPgReviews] = useState([]);
  const [newOwner, setNewOwner] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    aadharCard: "",
  });

  const [pgList, setPgList] = useState([]);
  const [pgBookings, setPgBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);


  // Load data when `view` changes
  useEffect(() => {
    setSelected(null);
    setShowAddForm(false);

    if (view === "users") {
      getAllUsers(token).then(setUsers);
    } else if (view === "owners") {
      getAllOwners(token).then(setOwners);
    } else if (view === "addOwner") {
      setShowAddForm(true);
    }
  }, [view, token]);

  const viewDetails = async (id, type) => {
    const data =
      type === "USER" ? await getUserById(id, token) : await getOwnerById(id, token);
    setSelected(data);
    setShowAddForm(false);
  };

  const handleDelete = async (id) => {
    await deleteOwnerById(id, token);
    getAllOwners(token).then(setOwners);
    setSelected(null);
  };

  const handleAddOwnerSubmit = async (e) => {
    e.preventDefault();
    await registerOwner(newOwner, token);
    getAllOwners(token).then(setOwners);
    setShowAddForm(false);
    setNewOwner({
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      aadharCard: "",
    });
  };

  useEffect(() => {
  setSelected(null);
  setShowAddForm(false);
  setPgReviews([]);

  if (view === "users") {
    getAllUsers(token).then(setUsers);
  } else if (view === "owners") {
    getAllOwners(token).then(setOwners);
  } else if (view === "addOwner") {
    setShowAddForm(true);
  }
}, [view, token]);

//GET ALL PGs

// useEffect(() => {
//   if (view === "pgReviews") {
//     getAllPgProperties(token)
//       .then((data) => {
//         console.log("Fetched PGs:", data);  // Check what you get here
//         setPgList(data);
//       })
//       .catch((err) => console.error("Error fetching PGs:", err));
//   }
// }, [view, token]);

useEffect(() => {
  if (view === "pgReviews" || view === "pgBookings") {
    getAllPgProperties(token)
      .then((data) => {
        console.log("Fetched PGs:", data);
        setPgList(data);
      })
      .catch((err) => console.error("Error fetching PGs:", err));
  }
}, [view, token]);


  return (
    <div>
      {showAddForm && (
        <form
          onSubmit={handleAddOwnerSubmit}
          className="max-w-md space-y-4 bg-gray-100 p-4 rounded shadow mb-6"
        >
          <h2 className="text-lg font-bold">Add New Owner</h2>
          <input
            type="text"
            placeholder="Name"
            className="w-full p-2 border"
            value={newOwner.name}
            onChange={(e) => setNewOwner({ ...newOwner, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border"
            value={newOwner.email}
            onChange={(e) => setNewOwner({ ...newOwner, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border"
            value={newOwner.password}
            onChange={(e) => setNewOwner({ ...newOwner, password: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Phone"
            className="w-full p-2 border"
            value={newOwner.phone}
            onChange={(e) => setNewOwner({ ...newOwner, phone: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="w-full p-2 border"
            value={newOwner.address}
            onChange={(e) => setNewOwner({ ...newOwner, address: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Aadhar Card"
            className="w-full p-2 border"
            value={newOwner.aadharCard}
            onChange={(e) => setNewOwner({ ...newOwner, aadharCard: e.target.value })}
            required
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Create Owner
          </button>
        </form>
      )}

      {(view === "users" || view === "owners") && (
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(view === "users" ? users : owners).map((item) => {
              const id = item.userId || item.ownerId;
              return (
                <tr key={id} className="border-t">
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.email}</td>
                  <td className="px-4 py-2">{item.phone}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() =>
                        viewDetails(id, view === "users" ? "USER" : "OWNER")
                      }
                      className="bg-blue-400 text-white px-2 py-1 rounded"
                    >
                      View
                    </button>
                    {view === "owners" && (
                      <button
                        onClick={() => handleDelete(id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {selected && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">Details</h2>
          <p>
            <strong>Name:</strong> {selected.name}
          </p>
          <p>
            <strong>Email:</strong> {selected.email}
          </p>
          <p>
            <strong>Phone:</strong> {selected.phone}
          </p>
          <p>
            <strong>Address:</strong> {selected.address}
          </p>
          {selected.role && (
            <p>
              <strong>Role:</strong> {selected.role}
            </p>
          )}
          {selected.aadharCard && (
            <p>
              <strong>Aadhar Card:</strong> {selected.aadharCard}
            </p>
          )}
        </div>
      )}

      {/* {view === "pgReviews" && (
      <div className="bg-white p-4 rounded shadow max-w-xl mx-auto mt-6">
        <h2 className="text-lg font-bold mb-4">Get Reviews for PG</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="number"
            placeholder="Enter PG ID"
            className="border p-2 w-full"
            value={pgIdForReview}
            onChange={(e) => setPgIdForReview(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={async () => {
              if (pgIdForReview) {
                try {
                  const reviews = await getReviewsByPgId(pgIdForReview, token);
                  setPgReviews(reviews);
                } catch (err) {
                  console.error("Error fetching reviews:", err);
                  setPgReviews([]);
                }
              }
            }}
          >
            Fetch Reviews
          </button>
        </div>

    {pgReviews.length > 0 ? (
      <table className="w-full table-auto border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2">Review ID</th>
            <th className="px-3 py-2">Rating</th>
            <th className="px-3 py-2">Comment</th>
            <th className="px-3 py-2">User</th>
          </tr>
        </thead>
        <tbody>
          {pgReviews.map((review) => (
            <tr key={review.reviewId} className="border-t">
              <td className="px-3 py-2">{review.reviewId}</td>
              <td className="px-3 py-2">{review.rating}</td>
              <td className="px-3 py-2">{review.comment}</td>
              <td className="px-3 py-2">{review.userName || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p className="text-gray-500">No reviews to show.</p>
    )}
  </div>
)} */}

    {view === "pgReviews" && (
        <div className="bg-white p-4 rounded shadow max-w-xl mx-auto mt-6">
          <h2 className="text-lg font-bold mb-4">Get Reviews for PG</h2>

          {/* Dropdown instead of input */}
          <div className="flex gap-2 mb-4">
            <select
              className="border p-2 w-full"
              value={pgIdForReview}
              onChange={(e) => setPgIdForReview(e.target.value)}
            >
              <option value="">Select a PG</option>
              {pgList.map((pg) => (
                <option key={pg.pgId} value={pg.pgId}>
                  {pg.name} (ID: {pg.pgId})
                </option>
              ))}
            </select>


            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={async () => {
                if (pgIdForReview) {
                  try {
                    const reviews = await getReviewsByPgId(pgIdForReview, token);
                    setPgReviews(reviews);
                  } catch (err) {
                    console.error("Error fetching reviews:", err);
                    setPgReviews([]);
                  }
                }
              }}
            >
              Fetch Reviews
            </button>
          </div>

          {/* Reviews Table */}
          {pgReviews.length > 0 ? (
            <table className="w-full table-auto border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2">Review ID</th>
                  <th className="px-3 py-2">Rating</th>
                  <th className="px-3 py-2">Comment</th>
                  <th className="px-3 py-2">User</th>
                </tr>
              </thead>
              <tbody>
                {pgReviews.map((review) => (
                  <tr key={review.reviewId} className="border-t">
                    <td className="px-3 py-2">{review.reviewId}</td>
                    <td className="px-3 py-2">{review.rating}</td>
                    <td className="px-3 py-2">{review.comment}</td>
                    <td className="px-3 py-2">{review.userName || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No reviews to show.</p>
          )}
        </div>
      )}

      {/* {view === "pgBookings" && (
  <div className="bg-white p-4 rounded shadow max-w-xl mx-auto mt-6">
    <h2 className="text-lg font-bold mb-4">Get Bookings for PG</h2>

    <div className="flex gap-2 mb-4">
      <select
        className="border p-2 w-full"
        value={pgIdForReview}
        onChange={(e) => setPgIdForReview(e.target.value)}
      >
        <option value="">Select a PG</option>
        {pgList.map((pg) => (
          <option key={pg.pgId} value={pg.pgId}>
            {pg.name} (ID: {pg.pgId})
          </option>
        ))}
      </select>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={async () => {
          if (pgIdForReview) {
            try {
              const bookings = await getBookingsByPgId(pgIdForReview, token);
              setPgBookings(bookings);
            } catch (err) {
              console.error("Error fetching bookings:", err);
              setPgBookings([]);
            }
          }
        }}
      >
        Fetch Bookings
      </button>
    </div>

    
    {pgBookings.length > 0 ? (
      <table className="w-full table-auto border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2">Booking ID</th>
            <th className="px-3 py-2">User</th>
            <th className="px-3 py-2">Room</th>
            <th className="px-3 py-2">Check-In</th>
            <th className="px-3 py-2">Check-Out</th>
          </tr>
        </thead>
        <tbody>
          {pgBookings.map((booking) => (
            <tr key={booking.bookingId} className="border-t">
              <td className="px-3 py-2">{booking.bookingId}</td>
              <td className="px-3 py-2">{booking.userName || "N/A"}</td>
              <td className="px-3 py-2">{booking.roomNumber || "N/A"}</td>
              <td className="px-3 py-2">{booking.checkInDate || "N/A"}</td>
              <td className="px-3 py-2">{booking.checkOutDate || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p className="text-gray-500">No bookings to show.</p>
    )}
  </div>
)} */}
    {view === "pgBookings" && (
  <div className="bg-white p-6 rounded shadow-lg max-w-4xl mx-auto mt-6">
    <h2 className="text-xl font-bold mb-6 text-center">PG Bookings</h2>

    {/* PG Selection */}
    <div className="flex gap-4 mb-6 items-center">
      <select
        className="border p-2 rounded w-full"
        value={pgIdForReview}
        onChange={(e) => setPgIdForReview(e.target.value)}
      >
        <option value="">Select a PG</option>
        {pgList.map((pg) => (
          <option key={pg.pgId} value={pg.pgId}>
            {pg.name} (ID: {pg.pgId})
          </option>
        ))}
      </select>

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
        onClick={async () => {
          if (pgIdForReview) {
            try {
              const bookings = await getBookingsByPgId(pgIdForReview, token);
              setPgBookings(bookings);
            } catch (err) {
              console.error("Error fetching bookings:", err);
              setPgBookings([]);
            }
          }
        }}
      >
        Fetch Bookings
      </button>
    </div>

    {/* Bookings Table */}
    {pgBookings.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-300 text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Booking ID</th>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Room</th>
              <th className="px-4 py-2">Check-In</th>
              <th className="px-4 py-2">Check-Out</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pgBookings.map((booking) => (
              <tr key={booking.bookingId} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{booking.bookingId}</td>
                <td className="px-4 py-2">{booking.userName || "N/A"}</td>
                <td className="px-4 py-2">{booking.roomId || "N/A"}</td>
                <td className="px-4 py-2">{booking.checkInDate || "N/A"}</td>
                <td className="px-4 py-2">{booking.checkOutDate || "N/A"}</td>
                <td className="px-4 py-2">
                  <button
                    className="text-blue-600 hover:underline text-xs"
                    onClick={async () => {
                      try {
                        const data = await getBookingById(booking.bookingId, token);
                        setSelectedBooking(data);
                        setShowBookingModal(true);
                      } catch (err) {
                        console.error("Error fetching booking details:", err);
                      }
                    }}
                  >
                    View
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showBookingModal && selectedBooking && (
  <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
    <div className="bg-white rounded-xl shadow-lg w-11/12 max-w-2xl p-6 relative">
      <h2 className="text-lg font-bold mb-4">Booking Details</h2>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <p><strong>Booking ID:</strong> {selectedBooking.bookingId}</p>
        <p><strong>Booking Date:</strong> {selectedBooking.bookingDate}</p>
        <p><strong>Status:</strong> {selectedBooking.status}</p>
        <p><strong>Check-In:</strong> {selectedBooking.checkInDate}</p>
        <p><strong>Check-Out:</strong> {selectedBooking.checkOutDate}</p>
        <p><strong>Room ID:</strong> {selectedBooking.roomId}</p>
        <p><strong>PG ID:</strong> {selectedBooking.pgPropertId}</p>
        <p><strong>PG Name:</strong> {selectedBooking.pgPropertyName}</p>
        <p><strong>User ID:</strong> {selectedBooking.userId}</p>
        <p><strong>User Name:</strong> {selectedBooking.userName}</p>
        <p><strong>Payment ID:</strong> {selectedBooking.paymentId}</p>
        <p><strong>Amount:</strong> ₹{selectedBooking.amount}</p>
        <p><strong>Payment Status:</strong> {selectedBooking.paymentStatus}</p>
        <p><strong>Payment Date:</strong> {selectedBooking.paymentDate}</p>
      </div>

      <button
        onClick={() => setShowBookingModal(false)}
        className="absolute top-2 right-3 text-gray-600 hover:text-black"
      >
        ✕
      </button>
    </div>
  </div>
)}

      </div>
    ) : (
      <p className="text-gray-500 mt-4 text-center">No bookings to display for this PG.</p>
    )}
  </div>
)}


    </div>
  );
};

export default AdminDashboard;
