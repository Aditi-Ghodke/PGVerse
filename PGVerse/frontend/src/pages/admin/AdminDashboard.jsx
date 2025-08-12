import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  const { view } = useOutletContext();

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

  // useEffect(() => {
  //   setSelected(null);
  //   setShowAddForm(false);
  //   setPgReviews([]);

  //   if (view === "users") {
  //     getAllUsers(token).then(setUsers);
  //   } else if (view === "owners") {
  //     getAllOwners(token).then(setOwners);
  //   } else if (view === "addOwner") {
  //     setShowAddForm(true);
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

  //validations

  const [errors, setErrors] = useState({});
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
        toast.success("Owner added successfully!");
      } catch (error) {
        console.error("Error creating owner:", error);
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

      {(view === "users" || view === "owners") && (
        <div className="overflow-x-auto mt-8 max-w-6xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
          <table className="min-w-full table-auto">
            <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
              <tr>
                <th className="px-6 py-4 text-left text-gray-700 font-bold uppercase tracking-wider border-b border-gray-200">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-gray-700 font-bold uppercase tracking-wider border-b border-gray-200">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-gray-700 font-bold uppercase tracking-wider border-b border-gray-200">
                  Phone
                </th>
                <th className="px-6 py-4 text-center text-gray-700 font-bold uppercase tracking-wider border-b border-gray-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {(view === "users" ? users : owners).map((item, idx) => {
                const id = item.userId || item.ownerId;
                return (
                  <tr
                    key={id}
                    className={`border-b border-gray-200 transition-colors ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                      {item.email}
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                      {item.phone}
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <button
                        onClick={() =>
                          viewDetails(id, view === "users" ? "USER" : "OWNER")
                        }
                        className="inline-flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm shadow-sm transition"
                      >
                        View
                      </button>
                      {view === "owners" && (
                        <button
                          onClick={() => handleDelete(id)}
                          className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm shadow-sm transition"
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              &times;
            </button>

            {/* Header */}
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Details
            </h2>

            {/* Details */}
            <div className="space-y-2 text-gray-700">
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

            {/* Footer */}
            <div className="mt-6 text-right">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {view === "pgReviews" && (
        <div className="bg-white p-6 rounded-lg shadow max-w-3xl mx-auto mt-8">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            Reviews for Selected PG
          </h2>
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
                  {pg.name}
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
              disabled={!pgIdForReview}
            >
              Fetch Reviews
            </button>
          </div>

          {pgReviews.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-lg mt-6">
              <table className="min-w-full bg-white text-gray-700 text-sm">
                <thead className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-3 text-left font-bold uppercase tracking-wide text-gray-700">
                      Review ID
                    </th>
                    <th className="px-5 py-3 text-left font-bold uppercase tracking-wide text-gray-700">
                      Rating
                    </th>
                    <th className="px-5 py-3 text-left font-bold uppercase tracking-wide text-gray-700">
                      Comment
                    </th>
                    <th className="px-5 py-3 text-left font-bold uppercase tracking-wide text-gray-700">
                      User
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pgReviews.map((review, idx) => (
                    <tr
                      key={review.reviewId}
                      className={`border-b border-gray-200 transition-colors ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50`}
                    >
                      <td className="px-5 py-3 font-medium">
                        {review.reviewId}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${
                            review.rating >= 4
                              ? "bg-green-500"
                              : review.rating >= 2
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        >
                          {review.rating}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-600">
                        {review.comment}
                      </td>
                      <td className="px-5 py-3">{review.userName || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-8 text-sm italic">
              No reviews to show. Please select a PG and fetch reviews.
            </p>
          )}
        </div>
      )}
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
                  {pg.name}
                </option>
              ))}
            </select>

            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* Bookings Table */}
          {pgBookings.length > 0 ? (
            <div className="overflow-x-auto rounded-md border border-gray-300 shadow-sm">
              <table className="w-full table-auto text-sm text-gray-700">
                <thead className="bg-gray-100 text-left text-gray-900">
                  <tr>
                    <th className="px-5 py-3 border-b border-gray-300">
                      Booking ID
                    </th>
                    <th className="px-5 py-3 border-b border-gray-300">User</th>
                    <th className="px-5 py-3 border-b border-gray-300">Room</th>
                    <th className="px-5 py-3 border-b border-gray-300">
                      Check-In
                    </th>
                    <th className="px-5 py-3 border-b border-gray-300">
                      Check-Out
                    </th>
                    <th className="px-5 py-3 border-b border-gray-300">
                      Actions
                    </th>
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
                      <td className="px-5 py-3">
                        {booking.checkInDate || "N/A"}
                      </td>
                      <td className="px-5 py-3">
                        {booking.checkOutDate || "N/A"}
                      </td>
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
                              console.error(
                                "Error fetching booking details:",
                                err
                              );
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
                    <span className="font-semibold">Status:</span>{" "}
                    {selectedBooking.status}
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
                    <span className="font-semibold">Room ID:</span>{" "}
                    {selectedBooking.roomId}
                  </p>
                  <p>
                    <span className="font-semibold">PG ID:</span>{" "}
                    {selectedBooking.pgPropertId}
                  </p>
                  <p>
                    <span className="font-semibold">PG Name:</span>{" "}
                    {selectedBooking.pgPropertyName}
                  </p>
                  <p>
                    <span className="font-semibold">User ID:</span>{" "}
                    {selectedBooking.userId}
                  </p>
                  <p>
                    <span className="font-semibold">User Name:</span>{" "}
                    {selectedBooking.userName}
                  </p>
                  <p>
                    <span className="font-semibold">Payment ID:</span>{" "}
                    {selectedBooking.paymentId}
                  </p>
                  <p>
                    <span className="font-semibold">Amount:</span> ₹
                    {selectedBooking.amount}
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
