import { useOutletContext } from "react-router-dom"; // to receive context from AdminLayout
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
  getBookingsByPgId,
} from "../../api/adminApi";

const AdminDashboard = () => {
  const { token } = useAuth();
  const { view } = useOutletContext(); // get `view` from AdminLayout

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
      type === "USER"
        ? await getUserById(id, token)
        : await getOwnerById(id, token);
    setSelected(data);
    setShowAddForm(false);
  };

  const handleDelete = async (id) => {
    await deleteOwnerById(id, token);
    getAllOwners(token).then(setOwners);
    setSelected(null);
  };

  // const handleAddOwnerSubmit = async (e) => {
  //   e.preventDefault();
  //   await registerOwner(newOwner, token);
  //   getAllOwners(token).then(setOwners);
  //   setShowAddForm(false);
  //   setNewOwner({
  //     name: "",
  //     email: "",
  //     password: "",
  //     phone: "",
  //     address: "",
  //     aadharCard: "",
  //   });
  // };

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

  //validations

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    let newErrors = {};

    if (!newOwner.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!newOwner.email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(newOwner.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!newOwner.password) {
      newErrors.password = "Password is required";
    } else if (newOwner.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!newOwner.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(newOwner.phone)) {
      newErrors.phone = "Phone must be exactly 10 digits";
    }

    if (!newOwner.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!newOwner.aadharCard) {
      newErrors.aadharCard = "Aadhar number is required";
    } else if (!/^[2-9]{1}[0-9]{11}$/.test(newOwner.aadharCard)) {
      newErrors.aadharCard = "Enter a valid 12-digit Aadhar number";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleAddOwnerSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await registerOwner(newOwner, token);
        const updatedOwners = await getAllOwners(token);
        setOwners(updatedOwners);

        // Reset form fields
        setNewOwner({
          name: "",
          email: "",
          password: "",
          phone: "",
          address: "",
          aadharCard: "",
        });

        // Clear errors and set success message
        setErrors({});
        setSuccessMessage("✅ Owner added successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        console.error("Error creating owner:", error);

        // Check if backend sent an "email exists" message
        if (error.response?.data?.message?.toLowerCase().includes("email")) {
          setErrors((prev) => ({
            ...prev,
            email: "This email is already registered",
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            email: "Failed to create owner. Try again.",
          }));
        }
      }
    }
  };

  return (
    <div>
      {/* {showAddForm && (
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
            onChange={(e) =>
              setNewOwner({ ...newOwner, email: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border"
            value={newOwner.password}
            onChange={(e) =>
              setNewOwner({ ...newOwner, password: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Phone"
            className="w-full p-2 border"
            value={newOwner.phone}
            onChange={(e) =>
              setNewOwner({ ...newOwner, phone: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="w-full p-2 border"
            value={newOwner.address}
            onChange={(e) =>
              setNewOwner({ ...newOwner, address: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Aadhar Card"
            className="w-full p-2 border"
            value={newOwner.aadharCard}
            onChange={(e) =>
              setNewOwner({ ...newOwner, aadharCard: e.target.value })
            }
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Create Owner
          </button>
        </form>
      )} */}

      {showAddForm && (
        <form
          onSubmit={handleAddOwnerSubmit}
          className="max-w-md space-y-4 bg-gray-100 p-4 rounded shadow mb-6"
        >
          <h2 className="text-lg font-bold">Add New Owner</h2>

          {/* Name */}
          <div>
            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 border"
              value={newOwner.name}
              onChange={(e) =>
                setNewOwner({ ...newOwner, name: e.target.value })
              }
            />
            {errors.name && (
              <p className="text-red-600 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border"
              value={newOwner.email}
              onChange={(e) =>
                setNewOwner({ ...newOwner, email: e.target.value })
              }
            />
            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 border"
              value={newOwner.password}
              onChange={(e) =>
                setNewOwner({ ...newOwner, password: e.target.value })
              }
            />
            {errors.password && (
              <p className="text-red-600 text-sm">{errors.password}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <input
              type="text"
              placeholder="Phone"
              className="w-full p-2 border"
              value={newOwner.phone}
              onChange={(e) =>
                setNewOwner({ ...newOwner, phone: e.target.value })
              }
            />
            {errors.phone && (
              <p className="text-red-600 text-sm">{errors.phone}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <input
              type="text"
              placeholder="Address"
              className="w-full p-2 border"
              value={newOwner.address}
              onChange={(e) =>
                setNewOwner({ ...newOwner, address: e.target.value })
              }
            />
            {errors.address && (
              <p className="text-red-600 text-sm">{errors.address}</p>
            )}
          </div>

          {/* Aadhar */}
          <div>
            <input
              type="text"
              placeholder="Aadhar Card"
              className="w-full p-2 border"
              value={newOwner.aadharCard}
              onChange={(e) =>
                setNewOwner({ ...newOwner, aadharCard: e.target.value })
              }
            />
            {errors.aadharCard && (
              <p className="text-red-600 text-sm">{errors.aadharCard}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-50 py-3 text-lg font-semibold text-white bg-indigo-600 rounded hover:bg-gray-600 transition duration-300"
          >
            Create Owner
          </button>
        </form>
      )}

      {/* {(view === "users" || view === "owners") && (
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
      )} */}
      {(view === "users" || view === "owners") && (
  <div className="overflow-x-auto mt-6 max-w-5xl mx-auto">
    <table className="min-w-full table-auto border border-gray-300 rounded-lg shadow-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-6 py-3 text-left text-gray-700 font-semibold border-b border-gray-300">Name</th>
          <th className="px-6 py-3 text-left text-gray-700 font-semibold border-b border-gray-300">Email</th>
          <th className="px-6 py-3 text-left text-gray-700 font-semibold border-b border-gray-300">Phone</th>
          <th className="px-6 py-3 text-center text-gray-700 font-semibold border-b border-gray-300">Actions</th>
        </tr>
      </thead>
      <tbody>
        {(view === "users" ? users : owners).map((item) => {
          const id = item.userId || item.ownerId;
          return (
            <tr key={id} className="border-b hover:bg-gray-50 transition">
              <td className="px-6 py-3 whitespace-nowrap">{item.name}</td>
              <td className="px-6 py-3 whitespace-nowrap">{item.email}</td>
              <td className="px-6 py-3 whitespace-nowrap">{item.phone}</td>
              <td className="px-6 py-3 whitespace-nowrap text-center space-x-3">
                <button
                  onClick={() => viewDetails(id, view === "users" ? "USER" : "OWNER")}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition"
                >
                  View
                </button>
                {view === "owners" && (
                  <button
                    onClick={() => handleDelete(id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition"
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
  </div>
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
                    const reviews = await getReviewsByPgId(
                      pgIdForReview,
                      token
                    );
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
  <div className="bg-white p-6 rounded-lg shadow max-w-3xl mx-auto mt-8">
    <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
      Reviews for Selected PG
    </h2>

    {/* PG Select and Fetch Button */}
    <div className="flex gap-4 mb-6">
      <select
        className="flex-grow border border-gray-300 rounded-md p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={pgIdForReview}
        onChange={(e) => setPgIdForReview(e.target.value)}
      >
        <option value="" disabled>
          -- Select a PG --
        </option>
        {pgList.map((pg) => (
          <option key={pg.pgId} value={pg.pgId}>
            {pg.name} (ID: {pg.pgId})
          </option>
        ))}
      </select>

      <button
        className={`px-6 py-3 rounded-md text-white font-semibold transition ${
          pgIdForReview
             ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-indigo-300 cursor-not-allowed"
        }`}
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
        disabled={!pgIdForReview}
      >
        Fetch Reviews
      </button>
    </div>

    {/* Reviews Table or No Reviews Message */}
    {pgReviews.length > 0 ? (
      <div className="overflow-x-auto rounded border border-gray-200 shadow-sm">
        <table className="min-w-full bg-white text-gray-700 text-sm">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Review ID</th>
              <th className="px-4 py-3 text-left font-medium">Rating</th>
              <th className="px-4 py-3 text-left font-medium">Comment</th>
              <th className="px-4 py-3 text-left font-medium">User</th>
            </tr>
          </thead>
          <tbody>
            {pgReviews.map((review) => (
              <tr
                key={review.reviewId}
                className="border-b last:border-b-0 hover:bg-gray-50"
              >
                <td className="px-4 py-3">{review.reviewId}</td>
                <td className="px-4 py-3">{review.rating}</td>
                <td className="px-4 py-3">{review.comment}</td>
                <td className="px-4 py-3">{review.userName || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="text-center text-gray-500 mt-8">
        No reviews to show. Please select a PG and fetch reviews.
      </p>
    )}
  </div>
)}
s

      {/* {view === "pgBookings" && (
        <div className="bg-white p-6 rounded shadow-lg max-w-4xl mx-auto mt-6">
          <h2 className="text-xl font-bold mb-6 text-center">PG Bookings</h2>

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
                    const bookings = await getBookingsByPgId(
                      pgIdForReview,
                      token
                    );
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
                    <tr
                      key={booking.bookingId}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="px-4 py-2">{booking.bookingId}</td>
                      <td className="px-4 py-2">{booking.userName || "N/A"}</td>
                      <td className="px-4 py-2">{booking.roomId || "N/A"}</td>
                      <td className="px-4 py-2">
                        {booking.checkInDate || "N/A"}
                      </td>
                      <td className="px-4 py-2">
                        {booking.checkOutDate || "N/A"}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          className="text-blue-600 hover:underline text-xs"
                          onClick={async () => {
                            try {
                              const data = await getBookingById(
                                booking.bookingId,
                                token
                              );
                              setSelectedBooking(data);
                              setShowBookingModal(true);
                            } catch (err) {
                              console.error(
                                "Error fetching booking details:",
                                err
                              );
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
                      <p>
                        <strong>Booking ID:</strong> {selectedBooking.bookingId}
                      </p>
                      <p>
                        <strong>Booking Date:</strong>{" "}
                        {selectedBooking.bookingDate}
                      </p>
                      <p>
                        <strong>Status:</strong> {selectedBooking.status}
                      </p>
                      <p>
                        <strong>Check-In:</strong> {selectedBooking.checkInDate}
                      </p>
                      <p>
                        <strong>Check-Out:</strong>{" "}
                        {selectedBooking.checkOutDate}
                      </p>
                      <p>
                        <strong>Room ID:</strong> {selectedBooking.roomId}
                      </p>
                      <p>
                        <strong>PG ID:</strong> {selectedBooking.pgPropertId}
                      </p>
                      <p>
                        <strong>PG Name:</strong>{" "}
                        {selectedBooking.pgPropertyName}
                      </p>
                      <p>
                        <strong>User ID:</strong> {selectedBooking.userId}
                      </p>
                      <p>
                        <strong>User Name:</strong> {selectedBooking.userName}
                      </p>
                      <p>
                        <strong>Payment ID:</strong> {selectedBooking.paymentId}
                      </p>
                      <p>
                        <strong>Amount:</strong> ₹{selectedBooking.amount}
                      </p>
                      <p>
                        <strong>Payment Status:</strong>{" "}
                        {selectedBooking.paymentStatus}
                      </p>
                      <p>
                        <strong>Payment Date:</strong>{" "}
                        {selectedBooking.paymentDate}
                      </p>
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
            <p className="text-gray-500 mt-4 text-center">
              No bookings to display for this PG.
            </p>
          )}
        </div>
      )} */}
      {view === "pgBookings" && (
  <div className="bg-white p-8 rounded-xl shadow-lg max-w-5xl mx-auto mt-8">
    <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
      PG Bookings
    </h2>

    {/* PG Selection */}
    <div className="flex flex-col sm:flex-row gap-4 items-center mb-8">
      <select
        className="border border-gray-300 rounded-md p-3 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      <div className="overflow-x-auto rounded-md border border-gray-300 shadow-sm">
        <table className="w-full table-auto text-sm text-gray-700">
          <thead className="bg-gray-100 text-left text-gray-900">
            <tr>
              <th className="px-5 py-3 border-b border-gray-300">Booking ID</th>
              <th className="px-5 py-3 border-b border-gray-300">User</th>
              <th className="px-5 py-3 border-b border-gray-300">Room</th>
              <th className="px-5 py-3 border-b border-gray-300">Check-In</th>
              <th className="px-5 py-3 border-b border-gray-300">Check-Out</th>
              <th className="px-5 py-3 border-b border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pgBookings.map((booking) => (
              <tr
                key={booking.bookingId}
                className="hover:bg-gray-50 border-b border-gray-200"
              >
                <td className="px-5 py-3">{booking.bookingId}</td>
                <td className="px-5 py-3">{booking.userName || "N/A"}</td>
                <td className="px-5 py-3">{booking.roomId || "N/A"}</td>
                <td className="px-5 py-3">{booking.checkInDate || "N/A"}</td>
                <td className="px-5 py-3">{booking.checkOutDate || "N/A"}</td>
                <td className="px-5 py-3">
                  <button
                    className="text-blue-600 hover:underline text-sm font-medium"
                    onClick={async () => {
                      try {
                        const data = await getBookingById(
                          booking.bookingId,
                          token
                        );
                        setSelectedBooking(data);
                        setShowBookingModal(true);
                      } catch (err) {
                        console.error("Error fetching booking details:", err);
                      }
                    }}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="text-center text-gray-500 mt-6">
        No bookings to display for this PG.
      </p>
    )}

    {/* Booking Details Modal */}
    {showBookingModal && selectedBooking && (
      <div className="fixed inset-0 flex items-center justify-center bg-opacity-40 backdrop-blur-sm z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-8 relative overflow-y-auto max-h-[80vh]">
          <button
            onClick={() => setShowBookingModal(false)}
            className="absolute top-4 right-6 text-gray-500 hover:text-gray-900 text-2xl font-bold"
            aria-label="Close modal"
          >
            &times;
          </button>

          <h3 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
            Booking Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-sm">
            <p>
              <span className="font-semibold">Booking ID:</span>{" "}
              {selectedBooking.bookingId}
            </p>
            <p>
              <span className="font-semibold">Booking Date:</span>{" "}
              {selectedBooking.bookingDate}
            </p>
            <p>
              <span className="font-semibold">Status:</span> {selectedBooking.status}
            </p>
            <p>
              <span className="font-semibold">Check-In:</span>{" "}
              {selectedBooking.checkInDate}
            </p>
            <p>
              <span className="font-semibold">Check-Out:</span>{" "}
              {selectedBooking.checkOutDate}
            </p>
            <p>
              <span className="font-semibold">Room ID:</span> {selectedBooking.roomId}
            </p>
            <p>
              <span className="font-semibold">PG ID:</span> {selectedBooking.pgPropertId}
            </p>
            <p>
              <span className="font-semibold">PG Name:</span> {selectedBooking.pgPropertyName}
            </p>
            <p>
              <span className="font-semibold">User ID:</span> {selectedBooking.userId}
            </p>
            <p>
              <span className="font-semibold">User Name:</span> {selectedBooking.userName}
            </p>
            <p>
              <span className="font-semibold">Payment ID:</span> {selectedBooking.paymentId}
            </p>
            <p>
              <span className="font-semibold">Amount:</span> ₹{selectedBooking.amount}
            </p>
            <p>
              <span className="font-semibold">Payment Status:</span>{" "}
              {selectedBooking.paymentStatus}
            </p>
            <p>
              <span className="font-semibold">Payment Date:</span>{" "}
              {selectedBooking.paymentDate}
            </p>
          </div>
        </div>
      </div>
    )}
  </div>
)}

    </div>
  );
};

export default AdminDashboard;
