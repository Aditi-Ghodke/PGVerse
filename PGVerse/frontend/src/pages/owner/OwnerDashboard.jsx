import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getOwnerById,
  changeOwnerPassword,
  updateOwner,
  addPgProperty,
  updatePgProperty,
  deletePgProperty,
  getPgByOwnerId,
  getPropertyById,
  addRoomToPg,
  updateRoom,
  deleteRoom,
  getAllRooms,
  getRoomById,
  addService,
  getRequestedServicesByPgId,
  manuallyUpdateBookings,
  getReviewByPgId,
  getBookingsByPgId,
  getServicesByPgId,
} from "../../api/ownerApi";

const OwnerDashboard = () => {
  const token = localStorage.getItem("token");
  const ownerId = localStorage.getItem("id");
  const ownerEmail = localStorage.getItem("email");

  const imageBaseUrl = "http://localhost:8080/";

  // Get current view from OwnerLayout
  const { view } = useOutletContext();

  // Owner Data and states
  const [ownerData, setOwnerData] = useState(null);
  const [error, setError] = useState("");

  const [updateSuccess, setUpdateSuccess] = useState("");
  const [updateError, setUpdateError] = useState("");

  // Edit Form states
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    card: "",
  });
  const [editMode, setEditMode] = useState(false);

  // Password Form states
  const [passwordForm, setPasswordForm] = useState({
    email: ownerEmail || "",
    oldPassword: "",
    newPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // PG Property states
  const [pgList, setPgList] = useState([]);
  const [pgForm, setPgForm] = useState({
    name: "",
    location: "",
    description: "",
    pgtype: "",
  });
  const [pgImageFile, setPgImageFile] = useState(null);
  const [pgError, setPgError] = useState("");
  const [pgSuccess, setPgSuccess] = useState("");
  const [pgUpdateMode, setPgUpdateMode] = useState(false);
  const [pgIdToUpdate, setPgIdToUpdate] = useState(null);

  // PG Details by ID
  const [pgIdInput, setPgIdInput] = useState("");
  const [pgDetails, setPgDetails] = useState(null);

  const [showPgModal, setShowPgModal] = useState(false);

  const fetchPgById = async (id) => {
    try {
      const res = await getPropertyById(id, token);
      setPgDetails(res.data);
      setPgError("");
      setShowPgModal(true); // Show modal on success
    } catch (err) {
      console.error("Error fetching PG by ID:", err);
      setPgDetails(null);
      setPgError("PG not found");
      setShowPgModal(false);
    }
  };

  //FETCH ALL PG BY OWNER ID
  const [pgListError, setPgListError] = useState("");

  const fetchPgByOwnerId = async () => {
    try {
      const res = await getPgByOwnerId(ownerId, token); // service call
      setPgList(res.data);
      setPgListError("");
    } catch (err) {
      console.error("Error fetching PGs by owner:", err);
      setPgList([]);
      setPgListError("Failed to fetch PGs");
    }
  };

  // Fetch owner data and PG list on mount
  useEffect(() => {
    if (!ownerId || !token) return;

    const fetchOwnerAndPg = async () => {
      try {
        const ownerRes = await getOwnerById(ownerId, token);
        setOwnerData(ownerRes.data);

        setEditForm({
          name: ownerRes.data.name || "",
          email: ownerRes.data.email || "",
          phone: ownerRes.data.phone || "",
          gender: ownerRes.data.gender || "",
          address: ownerRes.data.address || "",
          card: ownerRes.data.card || "",
        });

        const pgRes = await getPgByOwnerId(ownerId, token);
        setPgList(pgRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load owner or PG properties.");
      }
    };

    fetchOwnerAndPg();
  }, [ownerId, token]);

  // Owner Edit Handlers
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
    setUpdateSuccess("");
    setUpdateError("");
  };
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateOwner(ownerId, editForm, token);
      setEditMode(false);
      setError("");
      const res = await getOwnerById(ownerId, token);
      setOwnerData(res.data);
      // setUpdateSuccess("Owner details updated successfully!");
      toast.success("Owner details updated successfully!");
    } catch (err) {
      console.error("Failed to update owner:", err);
      setUpdateError("Failed to update owner details.");
    }
  };

  // Password Change Handlers
  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    setPasswordError("");
    setPasswordSuccess("");
  };
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    try {
      await changeOwnerPassword(passwordForm, token);
      // setPasswordSuccess("Password changed successfully");
      toast.success("Password changed successfully");
      setPasswordForm({
        email: ownerEmail || "",
        oldPassword: "",
        newPassword: "",
      });
    } catch (err) {
      console.error("Change password failed:", err);
      const errMsg = err.response?.data?.message || "Failed to change password";
      setPasswordError(errMsg);
    }
  };

  // PG Property Form Handlers
  const handlePgChange = (e) => {
    setPgForm({ ...pgForm, [e.target.name]: e.target.value });
    setPgError("");
    setPgSuccess("");
  };
  const handlePgImageChange = (e) => {
    setPgImageFile(e.target.files[0]);
  };
  const handlePgSubmit = async (e) => {
    e.preventDefault();
    setPgError("");
    setPgSuccess("");
    try {
      if (pgUpdateMode && pgIdToUpdate) {
        await updatePgProperty(pgIdToUpdate, pgForm, pgImageFile, token);
        setPgSuccess("PG Property updated successfully");
      } else {
        await addPgProperty(ownerId, pgForm, pgImageFile, token);
        // setPgSuccess("PG Property added successfully");
        toast.success("PG Property added successfully");
      }
      setPgForm({ name: "", location: "", description: "", pgtype: "" });
      setPgImageFile(null);
      setPgUpdateMode(false);
      setPgIdToUpdate(null);

      const res = await getPgByOwnerId(ownerId, token);
      setPgList(res.data || []);
    } catch (err) {
      console.error("PG property save failed:", err);
      const errMsg =
        err.response?.data?.message || "Failed to save PG Property";
      setPgError(errMsg);
    }
  };

  // PG Edit click handler
  const handleEditPgClick = (pg) => {
    const id = pg.id || pg.pgId || pg._id;
    setPgForm({
      name: pg.name || "",
      location: pg.location || "",
      description: pg.description || "",
      pgtype: pg.pgtype || "",
    });
    setPgUpdateMode(true);
    setPgIdToUpdate(id);
    setPgImageFile(null);
    setPgError("");
    setPgSuccess("");
  };

  // PG Delete handler
  const handleDeletePg = async (pg) => {
    if (!window.confirm(`Delete PG Property "${pg.name}"?`)) return;

    setPgError("");
    setPgSuccess("");

    try {
      const id = pg.pgId || pg.id || pg._id;
      await deletePgProperty(id, token);
      //setPgSuccess(`PG Property "${pg.name}" deleted successfully!`);
      toast.success(`PG Property "${pg.name}" deleted successfully!`);
      const res = await getPgByOwnerId(ownerId, token);
      setPgList(res.data || []);
    } catch (err) {
      console.error("Failed to delete PG property:", err);
      //setPgError("Failed to delete PG Property");
      toast.success("Failed to delete PG Property");
    }
  };

  //ADD ROOM
  const [roomData, setRoomData] = useState({
    roomNumber: "",
    capacity: 1,
    floor: 0,
    currentOccupancy: 0,
    pricePerMonth: 0,
    status: "AVAILABLE", // default status, adjust as per your enum
  });
  const [roomImage, setRoomImage] = useState(null);
  const [pgIdForRoom, setPgIdForRoom] = useState("");
  const [roomAddMsg, setRoomAddMsg] = useState("");
  const [roomAddError, setRoomAddError] = useState("");

  // Input change handler
  const handleRoomInputChange = (e) => {
    const { name, value } = e.target;
    // Convert numeric fields to numbers, keep others as string
    const val = [
      "capacity",
      "floor",
      "currentOccupancy",
      "pricePerMonth",
    ].includes(name)
      ? Number(value)
      : value;
    setRoomData({ ...roomData, [name]: val });
  };

  // File change handler
  const handleRoomImageChange = (e) => {
    setRoomImage(e.target.files[0]);
  };

  // const handleAddRoom = async () => {
  //   setRoomAddMsg("");
  //   setRoomAddError("");
  //   if (!pgIdForRoom) {
  //     setRoomAddError("Please select a PG ID.");
  //     return;
  //   }
  //   try {
  //     await addRoomToPg(pgIdForRoom, roomData, roomImage, token);
  //     setRoomAddMsg("Room added successfully!");
  //     setRoomData({
  //       roomNumber: "",
  //       capacity: 1,
  //       floor: 0,
  //       currentOccupancy: 0,
  //       pricePerMonth: "",
  //       status: "AVAILABLE",
  //     });
  //     setRoomImage(null);
  //     setPgIdForRoom("");
  //   } catch (err) {
  //     console.error("Error adding room:", err);
  //     const errMsg = err.response?.data?.message || "Failed to add room.";
  //     setRoomAddError(errMsg);
  //   }
  // };
  // Add room submit handler
  const handleAddRoom = async () => {
    setRoomAddMsg("");
    setRoomAddError("");

    // Validation checks
    if (!pgIdForRoom) {
      setRoomAddError("Please select a PG");
      return;
    }

    if (!roomData.roomNumber.trim()) {
      setRoomAddError("Room number is required.");
      return;
    }

    if (roomData.capacity <= 0) {
      setRoomAddError("Capacity must be at least 1.");
      return;
    }

    if (roomData.floor < 0) {
      setRoomAddError("Floor number cannot be negative.");
      return;
    }

    if (roomData.currentOccupancy < 0) {
      setRoomAddError("Current occupancy cannot be negative.");
      return;
    }

    if (
      !roomData.pricePerMonth ||
      isNaN(roomData.pricePerMonth) ||
      Number(roomData.pricePerMonth) <= 0
    ) {
      setRoomAddError("Please enter a valid price per month.");
      return;
    }

    if (!roomImage) {
      setRoomAddError("Please upload a room image.");
      return;
    }

    try {
      await addRoomToPg(pgIdForRoom, roomData, roomImage, token);
      //setRoomAddMsg(" Room added successfully!");
      toast.success("Room added successfully!");
      // Reset fields
      setRoomData({
        roomNumber: "",
        capacity: 1,
        floor: 0,
        currentOccupancy: 0,
        pricePerMonth: "",
        status: "AVAILABLE",
      });
      setRoomImage(null);
      setPgIdForRoom("");

      // Auto-hide success message after 3 seconds
      setTimeout(() => setRoomAddMsg(""), 3000);
    } catch (err) {
      console.error("Error adding room:", err);
      const errMsg = err.response?.data?.message || "Failed to add room.";
      setRoomAddError(errMsg);
    }
  };

  const [showRoomDetails, setShowRoomDetails] = useState(false);

  // UPDATE ROOM
  const [roomUpdateData, setRoomUpdateData] = useState({
    roomNumber: "",
    capacity: 1,
    floor: 0,
    currentOccupancy: 0,
    pricePerMonth: "",
    status: "AVAILABLE",
  });

  const [roomUpdateImage, setRoomUpdateImage] = useState(null);
  const [roomIdToUpdate, setRoomIdToUpdate] = useState("");
  const [roomUpdateMsg, setRoomUpdateMsg] = useState("");
  const [roomUpdateError, setRoomUpdateError] = useState("");

  const handleRoomUpdateInputChange = (e) => {
    setRoomUpdateData({ ...roomUpdateData, [e.target.name]: e.target.value });
  };

  const handleRoomUpdateImageChange = (e) => {
    setRoomUpdateImage(e.target.files[0]);
  };

  const handleUpdateRoom = async () => {
    try {
      if (!roomIdToUpdate) {
        setRoomUpdateError("No room selected for update.");
        return;
      }

      await updateRoom(roomIdToUpdate, roomUpdateData, roomUpdateImage, token);

      setRoomUpdateMsg("Room updated successfully!");
      setRoomUpdateError("");
      setRoomIdToUpdate(""); // clear selection
      setRoomUpdateImage(null); // clear file
      setRoomUpdateData({
        roomNumber: "",
        capacity: 1,
        floor: 0,
        currentOccupancy: 0,
        pricePerMonth: "",
        status: "AVAILABLE",
      });

      handleFetchAllRooms(); // refresh the table
    } catch (err) {
      console.error("Error updating room:", err);
      const errMsg = err.response?.data?.message || "Failed to update room.";
      //setRoomUpdateError(errMsg);
      //setRoomUpdateMsg("");
      console.error(errMsg);
      toast.error(errMsg);
    }
  };

  //DELETE, GET ALL, GET NY ID

  const [roomIdInput, setRoomIdInput] = useState("");
  const [pgIdForRooms, setPgIdForRooms] = useState("");
  const [fetchedRoom, setFetchedRoom] = useState(null);
  const [roomList, setRoomList] = useState([]);
  const [roomActionMsg, setRoomActionMsg] = useState("");

  const handleFetchRoomById = async () => {
    try {
      const res = await getRoomById(roomIdInput, token);
      setFetchedRoom(res.data);
      setRoomActionMsg("");
    } catch (err) {
      console.error("Error fetching room by ID:", err);
      setFetchedRoom(null);
      //setRoomActionMsg("Room not found.");
      toast.error("Room not found.");
    }
  };

  const handleFetchAllRooms = async () => {
    try {
      const res = await getAllRooms(pgIdForRooms, token);
      setRoomList(res.data);
      setRoomActionMsg("");
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setRoomList([]);

      toast.error("Room not found.");
    }
  };

  const handleDeleteRoom = async () => {
    try {
      await deleteRoom(roomIdInput, token);
      setRoomActionMsg("Room deleted successfully.");
    } catch (err) {
      console.error("Error deleting room:", err);
      setRoomActionMsg("Failed to delete room.");
      toast.error("Failed to delete room.");
    }
  };

  const fetchOwnerAndPg = async () => {
    try {
      const ownerRes = await getOwnerById(ownerId, token);
      setOwnerData(ownerRes.data);

      setEditForm({
        name: ownerRes.data.name || "",
        email: ownerRes.data.email || "",
        phone: ownerRes.data.phone || "",
        gender: ownerRes.data.gender || "",
        address: ownerRes.data.address || "",
        card: ownerRes.data.card || "",
      });

      const pgRes = await getPgByOwnerId(ownerId, token);
      setPgList(pgRes.data || []);

      console.log("Fetched PG List:", pgRes.data); // <--- add here
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to load owner or PG properties.");
    }
  };

  //SERVICES
  const [serviceData, setServiceData] = useState({
    serviceName: "",
    description: "",
  });
  const [serviceAddMsg, setServiceAddMsg] = useState("");
  const [serviceAddError, setServiceAddError] = useState("");
  const [pgIdForServices, setPgIdForServices] = useState("");
  const [servicesList, setServicesList] = useState([]);

  const handleServiceInputChange = (e) => {
    setServiceData({ ...serviceData, [e.target.name]: e.target.value });
  };

  const handleAddService = async () => {
    try {
      await addService(ownerId, serviceData, token);
      setServiceAddMsg("Service added successfully!");
      setServiceAddError("");
      setServiceData({ serviceName: "", description: "" });
    } catch (error) {
      console.error("Error adding service:", error);
      toast.error(error.response?.data?.message || "Failed to add service.");
    }
  };

  const handleGetRequestedServicesByPgId = async () => {
    if (!pgIdForServices) {
      console.warn("PG ID is not selected.");
      return;
    }

    try {
      console.log("Fetching services for PG ID:", pgIdForServices);
      const res = await getRequestedServicesByPgId(pgIdForServices, token);
      console.log("Fetched services:", res.data);
      setServicesList(res.data);
    } catch (error) {
      console.error("Error fetching services:", error);
      setServicesList([]);
    }
  };

  //REVIEWS BOOKINGS
  const [reviews, setReviews] = useState([]);
  const [reviewError, setReviewError] = useState("");
  const [pgIdForReviews, setPgIdForReviews] = useState("");

  const [bookings, setBookings] = useState([]);
  const [bookingError, setBookingError] = useState("");
  const [pgIdForBookings, setPgIdForBookings] = useState("");

  const [updateBookingMsg, setUpdateBookingMsg] = useState("");

  // Fetch reviews for PG
  const handleGetReviewsByPgId = async (pgId) => {
    console.log("Fetching reviews for PG ID:", pgId);
    try {
      const response = await getReviewByPgId(pgId, token);
      console.log("Reviews received:", response.data);
      setReviews(response.data);
      setReviewError("");
    } catch (error) {
      console.error("Review fetch failed:", error);
      setReviewError(
        error.response?.data?.message || "Failed to fetch reviews"
      );
      setReviews([]);
    }
  };

  // Fetch bookings for PG
  const handleGetBookingsByPgId = async (pgId) => {
    try {
      const response = await getBookingsByPgId(pgId, token);
      console.log("Bookings Response:", response.data);
      setBookings(response.data);
      setBookingError("");
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setReviewError(
        error.response?.data?.message || "Failed to fetch Bookings"
      );
    }
  };

  // Update bookings status manually
  const handleManuallyUpdateBookings = async () => {
    try {
      await manuallyUpdateBookings(token);
      setUpdateBookingMsg("Bookings status updated successfully");
    } catch (error) {
      setUpdateBookingMsg(
        error.response?.data?.message || "Failed to update bookings"
      );
    }
  };

  useEffect(() => {
    if (view === "getReviewsByPgId" && pgIdForReviews) {
      handleGetReviewsByPgId(pgIdForReviews);
    }
    if (view === "getBookingsByPgId" && pgIdForBookings) {
      handleGetBookingsByPgId(pgIdForBookings);
    }
  }, [view, pgIdForReviews, pgIdForBookings]);

  //services by pgid

  const [selectedPgId, setSelectedPgId] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await getServicesByPgId(selectedPgId, token);
        console.log("Fetched Rooms:", res.data); //
        setServicesList(res.data); // Use res.data here
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    if (selectedPgId) {
      fetchServices();
    }
  }, [selectedPgId]);

  useEffect(() => {
    const fetchRooms = async () => {
      if (!selectedPgId) return;

      try {
        const token = localStorage.getItem("token");
        const res = await getAllRooms(selectedPgId, token);
        setRoomList(res.data); // assuming response is a list of rooms
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setRoomList([]);
      }
    };

    fetchRooms();
  }, [selectedPgId]);

  const getPgByIdFromBookings = (pgId) => {
    const pgBooking = bookings.find((b) => b.pgId === parseInt(pgId));
    if (pgBooking) {
      return {
        pgId: pgBooking.pgId,
        name: pgBooking.pgName,
      };
    }
    return null; // not found
  };

  const selectedPg = getPgByIdFromBookings(selectedPgId);

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-10">
      {error && <p className="text-red-600">{error}</p>}

      {/* DASHBOARD VIEW */}
      {view === "dashboard" && ownerData && (
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Owner Information</h2>
          <p>
            <strong>Name:</strong> {ownerData.name}
          </p>
          <p>
            <strong>Email:</strong> {ownerData.email}
          </p>
          <p>
            <strong>Phone:</strong> {ownerData.phone}
          </p>
          <p>
            <strong>Gender:</strong> {ownerData.gender}
          </p>
          <p>
            <strong>Address:</strong> {ownerData.address}
          </p>
          <p>
            <strong>Card:</strong> {ownerData.card}
          </p>
        </div>
      )}

      {/* EDIT OWNER VIEW */}
      {view === "editOwner" && ownerData && (
        <form
          onSubmit={handleUpdateSubmit}
          className="bg-gray-100 p-4 rounded shadow space-y-4"
        >
          <h2 className="text-xl font-semibold">Edit Owner Details</h2>

          {updateSuccess && <p className="text-green-600">{updateSuccess}</p>}
          {updateError && <p className="text-red-600">{updateError}</p>}

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={editForm.name || ""}
            onChange={handleEditChange}
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="email"
            name="email"
            value={editForm.email || ""}
            disabled
            className="w-full p-2 border rounded bg-gray-200"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={editForm.phone || ""}
            onChange={handleEditChange}
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="text"
            name="gender"
            placeholder="Gender"
            value={editForm.gender || ""}
            onChange={handleEditChange}
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={editForm.address || ""}
            onChange={handleEditChange}
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            name="card"
            placeholder="Card"
            value={editForm.card || ""}
            onChange={handleEditChange}
            className="w-full p-2 border rounded"
          />

          <div className="flex space-x-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </form>
      )}

      {/* CHANGE PASSWORD VIEW */}
      {view === "changePassword" && (
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              value={passwordForm.email}
              readOnly
              className="w-full p-2 border rounded bg-gray-200 cursor-not-allowed"
            />
            <input
              type="password"
              name="oldPassword"
              placeholder="Current Password"
              value={passwordForm.oldPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 border rounded"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Change Password
            </button>
          </form>
          {passwordError && (
            <p className="text-red-600 mt-2">{passwordError}</p>
          )}
          {passwordSuccess && (
            <p className="text-green-600 mt-2">{passwordSuccess}</p>
          )}
        </div>
      )}

      {/* MANAGE PG VIEW */}
      {view === "managePG" && (
        <div>
          {/* PG Property Add/Update Form */}
          <div className="bg-gray-100 p-4 rounded shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {pgUpdateMode ? "Update PG Property" : "Add PG Property"}
            </h2>
            <form onSubmit={handlePgSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={pgForm.name}
                onChange={handlePgChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={pgForm.location}
                onChange={handlePgChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={pgForm.description}
                onChange={handlePgChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="pgtype"
                placeholder="PG Type"
                value={pgForm.pgtype}
                onChange={handlePgChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handlePgImageChange}
                className="w-full p-2 border rounded"
              />
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                {pgUpdateMode ? "Update PG Property" : "Add PG Property"}
              </button>
            </form>
            {pgError && <p className="text-red-600 mt-2">{pgError}</p>}
            {pgSuccess && <p className="text-green-600 mt-2">{pgSuccess}</p>}
          </div>

          {/* PG Properties List with Edit and Delete */}
          <div className="bg-gray-50 p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Your PG Properties</h2>
            {pgList.length === 0 ? (
              <p>No PG properties added yet.</p>
            ) : (
              pgList.map((pg) => {
                const id = pg.id || pg.pgId || pg._id;
                return (
                  <div
                    key={id || Math.random()}
                    className="border p-2 mb-2 rounded bg-white shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <p>
                        <strong>{pg.name}</strong> - {pg.location}
                      </p>
                      <p>{pg.description}</p>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEditPgClick(pg)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePg(pg)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/*GET PG BY OWNER ID */}

      {view === "getPgByOwnerId" && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">All PGs by You</h2>

          {pgListError && <p className="text-red-600 mb-4">{pgListError}</p>}

          {pgList.length === 0 ? (
            <p className="text-gray-600">No PGs found for this owner.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-100 text-black">
                    <th className="px-4 py-2 border">ID</th>
                    <th className="px-4 py-2 border">Name</th>
                    <th className="px-4 py-2 border">Location</th>
                    <th className="px-4 py-2 border">Type</th>
                    <th className="px-4 py-2 border">Status</th>
                    <th className="px-4 py-2 border">Description</th>
                    <th className="px-4 py-2 border">Owner</th>
                    <th className="px-4 py-2 border">Actions</th>
                  </tr>
                </thead>

                <tbody className="text-black">
                  {pgList.map((pg) => (
                    <tr key={pg.pgId} className="text-center hover:bg-gray-50">
                      <td className="px-4 py-2 border">{pg.pgId}</td>
                      <td className="px-4 py-2 border">{pg.name}</td>
                      <td className="px-4 py-2 border">{pg.location}</td>
                      <td className="px-4 py-2 border">{pg.pgType}</td>
                      <td className="px-4 py-2 border">{pg.status}</td>
                      <td className="px-4 py-2 border">{pg.description}</td>
                      <td className="px-4 py-2 border">{pg.ownername}</td>
                      <td className="px-4 py-2 border">
                        <button
                          onClick={() => fetchPgById(pg.pgId)}
                          className="bg-indigo-600 hover:bg-gray-500 text-white px-3 py-1 rounded"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PG DETAILS MODAL */}
          {showPgModal && pgDetails && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
              <div className="bg-white rounded-xl p-6 w-11/12 max-w-xl relative">
                <button
                  onClick={() => setShowPgModal(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg font-bold"
                >
                  ×
                </button>
                <h2 className="text-2xl font-semibold mb-4">
                  PG Property Details
                </h2>
                <div className="space-y-2 text-gray-800">
                  <p>
                    <strong>ID:</strong> {pgDetails.pgId}
                  </p>
                  <p>
                    <strong>Name:</strong> {pgDetails.name}
                  </p>
                  <p>
                    <strong>Location:</strong> {pgDetails.location}
                  </p>
                  <p>
                    <strong>Type:</strong> {pgDetails.pgType}
                  </p>
                  <p>
                    <strong>Status:</strong> {pgDetails.status}
                  </p>
                  <p>
                    <strong>Description:</strong> {pgDetails.description}
                  </p>
                  <p>
                    <strong>Owner ID:</strong> {pgDetails.ownerid}
                  </p>
                  <p>
                    <strong>Owner Name:</strong> {pgDetails.ownername}
                  </p>
                  {pgDetails.imagePath && (
                    <img
                      src={`http://localhost:8080/${pgDetails.imagePath}`}
                      alt={pgDetails.name}
                      className="w-full h-48 object-cover rounded mb-4"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PG Details Modal */}
      {view === "viewPgDetails" && pgDetails && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm z-50"
          onClick={() => setView("getPgByOwnerId")} // click outside closes modal
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()} // prevent modal close on inner click
          >
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setView("getPgByOwnerId")}
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold mb-4">{pgDetails.name}</h2>
            <p>
              <strong>ID:</strong> {pgDetails.pgId}
            </p>
            <p>
              <strong>Location:</strong> {pgDetails.location}
            </p>
            <p>
              <strong>Type:</strong> {pgDetails.pgType}
            </p>
            <p>
              <strong>Status:</strong> {pgDetails.status}
            </p>
            <p>
              <strong>Description:</strong> {pgDetails.description}
            </p>
            <p>
              <strong>Owner:</strong> {pgDetails.ownername}
            </p>
            {/* Add any other fields */}
          </div>
        </div>
      )}

      {/* OPTIONAL: Get PG By ID view if you want to enable manual fetch */}
      {view === "getPgById" && (
        <div className="bg-gray-100 p-4 rounded shadow space-y-4">
          <h2 className="text-xl font-semibold mb-4">Get PG By ID</h2>
          <input
            type="text"
            value={pgIdInput}
            onChange={(e) => setPgIdInput(e.target.value)}
            placeholder="Enter PG ID"
            className="w-full p-2 border rounded"
          />
          <button
            onClick={fetchPgById}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Fetch PG
          </button>

          {pgError && <p className="text-red-600">{pgError}</p>}
          {pgDetails && (
            <div className="bg-white p-4 border rounded space-y-1">
              <p>
                <strong>PG ID:</strong> {pgDetails.pgId}
              </p>
              <p>
                <strong>Name:</strong> {pgDetails.name}
              </p>
              <p>
                <strong>Location:</strong> {pgDetails.location}
              </p>
              <p>
                <strong>PG Type:</strong> {pgDetails.pgType}
              </p>
              <p>
                <strong>Status:</strong> {pgDetails.status}
              </p>
              <p>
                <strong>Description:</strong> {pgDetails.description}
              </p>
              <p>
                <strong>Owner ID:</strong> {pgDetails.ownerid}
              </p>
              <p>
                <strong>Owner Name:</strong> {pgDetails.ownername}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ADD ROOM */}
      {view === "addRoom" && (
        <div className="bg-white p-6 rounded shadow max-w-md mx-auto mt-6">
          <h2 className="text-2xl font-semibold mb-4">Add Room to PG</h2>

          <label className="block mb-2 font-medium" htmlFor="pgIdForRoom">
            Select PG
          </label>
          <select
            id="pgIdForRoom"
            value={pgIdForRoom}
            onChange={(e) => setPgIdForRoom(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
            required
          >
            <option value="">-- Select PG --</option>
            {pgList.map((pg) => (
              <option key={pg.pgId} value={pg.pgId}>
                {pg.name}
              </option>
            ))}
          </select>

          <label className="block mb-2 font-medium" htmlFor="roomNumber">
            Room Number
          </label>
          <input
            type="text"
            id="roomNumber"
            name="roomNumber"
            value={roomData.roomNumber}
            onChange={handleRoomInputChange}
            placeholder="Enter room number"
            className="w-full mb-4 p-2 border rounded"
            required
          />

          <label className="block mb-2 font-medium" htmlFor="floor">
            Floor
          </label>
          <input
            type="number"
            id="floor"
            name="floor"
            value={roomData.floor}
            onChange={handleRoomInputChange}
            min={0}
            className="w-full mb-4 p-2 border rounded"
            required
          />

          <label className="block mb-2 font-medium" htmlFor="capacity">
            Capacity
          </label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            value={roomData.capacity}
            onChange={handleRoomInputChange}
            min={1}
            className="w-full mb-4 p-2 border rounded"
            required
          />

          <label className="block mb-2 font-medium" htmlFor="currentOccupancy">
            Current Occupancy
          </label>
          <input
            type="number"
            id="currentOccupancy"
            name="currentOccupancy"
            value={roomData.currentOccupancy}
            onChange={handleRoomInputChange}
            min={0}
            className="w-full mb-4 p-2 border rounded"
          />

          <>
            <style>
              {`
          /* Hide number input arrows for Chrome, Safari, Edge */
          input.no-arrows::-webkit-outer-spin-button,
          input.no-arrows::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }

          /* Hide number input arrows for Firefox */
          input.no-arrows {
            -moz-appearance: textfield;
          }
        `}
            </style>
          </>
          <label className="block mb-2 font-medium" htmlFor="pricePerMonth">
            Price Per Month (₹)
          </label>
          <input
            type="number"
            id="pricePerMonth"
            name="pricePerMonth"
            value={roomData.pricePerMonth === 0 ? "" : roomData.pricePerMonth}
            onChange={handleRoomInputChange}
            min={0}
            required
            className="w-full mb-4 p-2 border rounded no-arrows"
          />

          <label className="block mb-2 font-medium" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={roomData.status}
            onChange={handleRoomInputChange}
            className="w-full mb-4 p-2 border rounded"
          >
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="OCCUPIED">OCCUPIED</option>
            <option value="MAINTENANCE">MAINTENANCE</option>
            <option value="MAINTENANCE">BOOKED</option>
            <option value="MAINTENANCE">UNAVAILABLE</option>
          </select>

          <label className="block mb-2 font-medium" htmlFor="roomImage">
            Room Image
          </label>
          <input
            type="file"
            id="roomImage"
            accept="image/*"
            onChange={handleRoomImageChange}
            className="w-full mb-4"
          />

          {roomAddMsg && <p className="text-green-600 mb-2">{roomAddMsg}</p>}
          {roomAddError && <p className="text-red-600 mb-2">{roomAddError}</p>}

          <button
            onClick={handleAddRoom}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Add Room
          </button>
        </div>
      )}

      {/* UPDATE ROOM */}
      {view === "updateRoom" && (
        <div className="bg-white p-4 rounded shadow mt-4">
          <h2 className="text-lg font-semibold mb-4">Update Room</h2>

          {roomUpdateMsg && <p className="text-green-600">{roomUpdateMsg}</p>}
          {roomUpdateError && <p className="text-red-600">{roomUpdateError}</p>}

          <input
            type="text"
            name="roomId"
            placeholder="Enter Room ID to update"
            value={roomIdToUpdate}
            onChange={(e) => setRoomIdToUpdate(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />

          <input
            type="text"
            name="roomNumber"
            placeholder="Room Number"
            value={roomUpdateData.roomNumber}
            onChange={handleRoomUpdateInputChange}
            className="w-full mb-4 p-2 border rounded"
          />

          <input
            type="number"
            name="floor"
            placeholder="Floor"
            value={roomUpdateData.floor}
            onChange={handleRoomUpdateInputChange}
            className="w-full mb-4 p-2 border rounded no-arrows"
          />

          <input
            type="number"
            name="capacity"
            placeholder="Capacity"
            value={roomUpdateData.capacity}
            onChange={handleRoomUpdateInputChange}
            className="w-full mb-4 p-2 border rounded no-arrows"
          />

          <input
            type="number"
            name="currentOccupancy"
            placeholder="Current Occupancy"
            value={roomUpdateData.currentOccupancy}
            onChange={handleRoomUpdateInputChange}
            className="w-full mb-4 p-2 border rounded no-arrows"
          />

          <input
            type="number"
            name="pricePerMonth"
            placeholder="Price Per Month"
            value={roomUpdateData.pricePerMonth}
            onChange={handleRoomUpdateInputChange}
            className="w-full mb-4 p-2 border rounded no-arrows"
          />

          <select
            name="status"
            value={roomUpdateData.status}
            onChange={handleRoomUpdateInputChange}
            className="w-full mb-4 p-2 border rounded"
          >
            <option value="AVAILABLE">Available</option>
            <option value="OCCUPIED">Occupied</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={handleRoomUpdateImageChange}
            className="w-full mb-4"
          />

          <button
            onClick={handleUpdateRoom}
            className="bg-yellow-500 text-white px-4 py-2 rounded w-full"
          >
            Update Room
          </button>
        </div>
      )}

      {/* DELETE, GET ALL, GET BY ID */}
      {view === "getRoomById" && (
        <div className="bg-white p-4 border rounded mt-4">
          <label className="block mb-2">Enter Room ID</label>
          <input
            type="text"
            value={roomIdInput}
            onChange={(e) => setRoomIdInput(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <button
            onClick={handleFetchRoomById}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Get Room
          </button>

          {fetchedRoom && (
            <div className="mt-4">
              <p>
                <strong>Room Number:</strong> {fetchedRoom.roomNumber}
              </p>
              <p>
                <strong>Floor:</strong> {fetchedRoom.floor}
              </p>
              <p>
                <strong>Capacity:</strong> {fetchedRoom.capacity}
              </p>
              <p>
                <strong>Price:</strong> ₹{fetchedRoom.pricePerMonth}
              </p>
              {/* Add more if needed */}
            </div>
          )}
          {roomActionMsg && (
            <p className="text-red-500 mt-2">{roomActionMsg}</p>
          )}
        </div>
      )}

      {view === "getAllRooms" && (
        <div className="bg-white p-6 border border-gray-300 rounded-xl mt-6 shadow-lg w-full mx-auto">
          <label className="block mb-3 text-lg font-semibold text-gray-700">
            Select PG
          </label>
          <select
            className="border border-gray-300 p-3 w-full rounded-md text-base mb-4"
            value={pgIdForRooms}
            onChange={(e) => setPgIdForRooms(e.target.value)}
            required
          >
            <option value="">-- Select PG --</option>
            {pgList.map((pg) => (
              <option key={pg.pgId} value={pg.pgId}>
                {pg.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleFetchAllRooms}
            className="bg-blue-600 hover:bg-blue-700 text-white text-base px-5 py-2 rounded-md transition"
            disabled={!pgIdForRooms}
          >
            Fetch Rooms
          </button>

          <div className="mt-4">
            {roomList.length > 0 ? (
              <>
                <table className="w-full table-auto border border-gray-300 border-collapse mt-6 text-base rounded-md overflow-hidden shadow-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-3 bg-gray-100 font-semibold text-left">
                        Room ID
                      </th>
                      <th className="border px-4 py-3 bg-gray-100 font-semibold text-left">
                        Room No
                      </th>
                      <th className="border px-4 py-3 bg-gray-100 font-semibold text-left">
                        Floor
                      </th>
                      <th className="border px-4 py-3 bg-gray-100 font-semibold text-left">
                        Capacity
                      </th>
                      <th className="border px-4 py-3 bg-gray-100 font-semibold text-left">
                        Current Occupancy
                      </th>
                      <th className="border px-4 py-3 bg-gray-100 font-semibold text-left">
                        Price
                      </th>
                      <th className="border px-4 py-3 bg-gray-100 font-semibold text-left">
                        Status
                      </th>
                      <th className="border px-4 py-3 bg-gray-100 font-semibold text-left">
                        PG ID
                      </th>
                      <th className="border px-4 py-3 bg-gray-100 font-semibold text-left">
                        PG Name
                      </th>

                      <th className="border px-4 py-3 bg-gray-100 font-semibold text-left">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {roomList.map((room) => (
                      <tr key={room.roomId}>
                        <td className="border px-2 py-1">{room.roomId}</td>
                        <td className="border px-2 py-1">{room.roomNumber}</td>
                        <td className="border px-2 py-1">{room.floor}</td>
                        <td className="border px-2 py-1">{room.capacity}</td>
                        <td className="border px-2 py-1">
                          {room.currentOccupancy || 0}
                        </td>
                        <td className="border px-2 py-1">
                          ₹{room.pricePerMonth.toFixed(2)}
                        </td>
                        <td className="border px-2 py-1">{room.status}</td>
                        <td className="border px-2 py-1">{room.pgId}</td>
                        <td className="border px-2 py-1">{room.pgName}</td>

                        <td className="border px-2 py-1 space-x-2">
                          <button
                            onClick={() => {
                              setRoomIdToUpdate(room.roomId);
                              setRoomUpdateData({
                                roomNumber: room.roomNumber,
                                capacity: room.capacity,
                                floor: room.floor,
                                currentOccupancy: room.currentOccupancy || 0,
                                pricePerMonth: room.pricePerMonth,
                                status: room.status,
                                pgId: room.pgId,
                                pgName: room.pgName,
                                imagePath: room.imagePath,
                              });
                            }}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md"
                          >
                            Edit
                          </button>
                          <button
                            onClick={async () => {
                              if (
                                confirm(
                                  "Are you sure you want to delete this room?"
                                )
                              ) {
                                await handleDeleteRoom(room.roomId);
                                handleFetchAllRooms(); // Refresh list after deletion
                              }
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md"
                          >
                            Delete
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                const res = await getRoomById(
                                  room.roomId,
                                  token
                                ); // token must be defined in your component
                                setFetchedRoom(res.data);
                                setShowRoomDetails(true);
                              } catch (err) {
                                console.error(
                                  "Error fetching room details:",
                                  err
                                );
                                setFetchedRoom(null);
                                setShowRoomDetails(false);
                                setRoomActionMsg("Room details not found.");
                              }
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                          >
                            View
                          </button>
                        </td>
                        {showRoomDetails && fetchedRoom && (
                          <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30">
                            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-xl w-full relative">
                              <button
                                onClick={() => setShowRoomDetails(false)}
                                className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl font-bold"
                              >
                                ×
                              </button>
                              <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
                                Room Details (ID: {fetchedRoom.roomId})
                              </h2>
                              <div className="grid grid-cols-2 gap-4 text-gray-700">
                                <p>
                                  <strong>Room No:</strong>{" "}
                                  {fetchedRoom.roomNumber}
                                </p>
                                <p>
                                  <strong>Floor:</strong> {fetchedRoom.floor}
                                </p>
                                <p>
                                  <strong>Capacity:</strong>{" "}
                                  {fetchedRoom.capacity}
                                </p>
                                <p>
                                  <strong>Occupancy:</strong>{" "}
                                  {fetchedRoom.currentOccupancy || 0}
                                </p>
                                <p>
                                  <strong>Price:</strong> ₹
                                  {fetchedRoom.pricePerMonth.toFixed(2)}
                                </p>
                                <p>
                                  <strong>Status:</strong> {fetchedRoom.status}
                                </p>
                                <p>
                                  <strong>PG ID:</strong> {fetchedRoom.pgId}
                                </p>
                                <p>
                                  <strong>PG Name:</strong> {fetchedRoom.pgName}
                                </p>
                              </div>
                              {fetchedRoom.imagePath && (
                                <div className="mt-4 text-center">
                                  <img
                                    src={`${imageBaseUrl}${fetchedRoom.imagePath}`}
                                    alt={`Room ${fetchedRoom.roomNumber}`}
                                    className="w-64 h-40 object-cover rounded mx-auto"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* UPDATE FORM SECTION */}
                {roomIdToUpdate && (
                  <div className="mt-6 bg-gray-50 border p-4 rounded">
                    <h2 className="text-lg font-semibold mb-2">Update Room</h2>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdateRoom();
                        handleFetchAllRooms(); // Refresh list after update
                        setRoomIdToUpdate(""); // Close update form
                      }}
                      className="space-y-3"
                    >
                      <input
                        type="text"
                        placeholder="Room Number"
                        value={roomUpdateData.roomNumber}
                        onChange={(e) =>
                          setRoomUpdateData({
                            ...roomUpdateData,
                            roomNumber: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded"
                      />
                      <input
                        type="number"
                        placeholder="Floor"
                        value={roomUpdateData.floor}
                        onChange={(e) =>
                          setRoomUpdateData({
                            ...roomUpdateData,
                            floor: Number(e.target.value),
                          })
                        }
                        className="w-full p-2 border rounded"
                      />
                      <input
                        type="number"
                        placeholder="Capacity"
                        value={roomUpdateData.capacity}
                        onChange={(e) =>
                          setRoomUpdateData({
                            ...roomUpdateData,
                            capacity: Number(e.target.value),
                          })
                        }
                        className="w-full p-2 border rounded"
                      />
                      <input
                        type="number"
                        placeholder="Price per Month"
                        value={roomUpdateData.pricePerMonth}
                        onChange={(e) =>
                          setRoomUpdateData({
                            ...roomUpdateData,
                            pricePerMonth: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded"
                      />
                      <select
                        value={roomUpdateData.status}
                        onChange={(e) =>
                          setRoomUpdateData({
                            ...roomUpdateData,
                            status: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded"
                      >
                        <option value="AVAILABLE">Available</option>
                        <option value="OCCUPIED">Occupied</option>
                        <option value="MAINTENANCE">Maintenance</option>
                      </select>

                      <input
                        type="file"
                        onChange={(e) => setRoomUpdateImage(e.target.files[0])}
                        className="w-full p-2 border rounded"
                      />

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                          Update Room
                        </button>
                        <button
                          type="button"
                          onClick={() => setRoomIdToUpdate("")}
                          className="bg-gray-500 text-white px-4 py-2 rounded"
                        >
                          Cancel
                        </button>
                      </div>

                      {roomUpdateMsg && (
                        <p className="text-green-600">{roomUpdateMsg}</p>
                      )}
                      {roomUpdateError && (
                        <p className="text-red-600">{roomUpdateError}</p>
                      )}
                    </form>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500 mt-2">{roomActionMsg}</p>
            )}
          </div>
        </div>
      )}

      {view === "deleteRoom" && (
        <div className="bg-white p-4 border rounded mt-4">
          <label className="block mb-2">Enter Room ID to Delete</label>
          <input
            type="text"
            value={roomIdInput}
            onChange={(e) => setRoomIdInput(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <button
            onClick={handleDeleteRoom}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete Room
          </button>
          {roomActionMsg && (
            <p className="text-red-500 mt-2">{roomActionMsg}</p>
          )}
        </div>
      )}

      {/* SERVICES */}
      {view === "addService" && (
        <div className="bg-white p-4 rounded shadow mt-4">
          <h2 className="text-lg font-semibold mb-3">Add Service</h2>

          <label className="block mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={serviceData.name}
            onChange={handleServiceInputChange}
            className="w-full p-2 border rounded mb-3"
            required
          />

          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            value={serviceData.description}
            onChange={handleServiceInputChange}
            className="w-full p-2 border rounded mb-3"
            rows={3}
            required
          />

          <label className="block mb-1">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={serviceData.price}
            onChange={handleServiceInputChange}
            min={0}
            step="0.01"
            className="w-full p-2 border rounded mb-3"
            required
          />

          <label className="block mb-1">Select PG</label>
          <select
            value={selectedPgId}
            onChange={(e) => setSelectedPgId(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          >
            <option value="">Select a PG</option>
            {pgList.map((pg) => (
              <option key={pg.pgId} value={pg.pgId}>
                {pg.name}
              </option>
            ))}
          </select>

          <label className="block mb-1">Room</label>
          <select
            name="roomId"
            value={serviceData.roomId}
            onChange={handleServiceInputChange}
            className="w-full p-2 border rounded mb-3"
            required
          >
            <option value="">Select a Room</option>
            {roomList.map((room) => (
              <option key={room.roomId} value={room.roomId}>
                Room {room.roomId} (Floor {room.floor})
              </option>
            ))}
          </select>

          <button
            onClick={handleAddService}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Service
          </button>

          {serviceAddMsg && (
            <p className="text-green-600 mt-2">{serviceAddMsg}</p>
          )}
          {serviceAddError && (
            <p className="text-red-600 mt-2">{serviceAddError}</p>
          )}
        </div>
      )}

      {view === "getRequestedServicesByPgId" && (
        <div className="bg-white p-4 rounded shadow mt-4 max-w-3xl mx-auto">
          <h2 className="text-lg font-semibold mb-4 text-center">
            View Services by PG
          </h2>

          {/* PG Dropdown */}
          <label className="block mb-2 font-medium text-gray-700">
            Select PG
          </label>
          <select
            className="w-full p-2 border rounded mb-3"
            value={pgIdForServices}
            onChange={(e) => setPgIdForServices(e.target.value)}
          >
            <option value="">-- Select PG --</option>
            {pgList.map((pg) => (
              <option key={pg.pgId} value={pg.pgId}>
                {pg.name}
              </option>
            ))}
          </select>

          {/* Fetch Button */}
          <button
            onClick={handleGetRequestedServicesByPgId}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
            disabled={!pgIdForServices}
          >
            Fetch Services
          </button>

          {servicesList.length > 0 ? (
            <div className="mt-6 space-y-4">
              {servicesList.map((service) => (
                <div
                  key={service.serviceId}
                  className="border rounded p-4 shadow-sm bg-gray-50"
                >
                  <h3 className="text-lg font-semibold text-indigo-700 mb-1">
                    {service.serviceName} (Service ID: {service.serviceId})
                  </h3>

                  <p className="text-gray-700 mb-1">
                    <strong>Description:</strong> {service.serviceDescription}
                  </p>

                  <p className="text-gray-700 mb-1">
                    <strong>Price:</strong> ₹{service.servicePrice.toFixed(2)}
                  </p>

                  <p className="text-gray-700 mb-1">
                    <strong>PG:</strong> {service.pgName} (ID: {service.pgId})
                  </p>

                  <p className="text-gray-700 mb-1">
                    <strong>Room ID:</strong> {service.roomId || "N/A"}
                  </p>

                  <p className="text-gray-700 mb-1">
                    <strong>User:</strong> {service.userName} (User ID:{" "}
                    {service.userId})
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-gray-600">No services found.</p>
          )}
        </div>
      )}

      {/* REVIEWS */}

      {/* Dropdown to choose PG ID for Reviews */}
      {view === "getReviewsByPgId" && (
        <div className="mb-4">
          <label className="block font-medium mb-1">
            Select PG for Reviews:
          </label>
          <select
            className="border p-2 rounded w-full"
            value={pgIdForReviews}
            onChange={(e) => setPgIdForReviews(e.target.value)}
          >
            <option value="">Select PG</option>
            {pgList.map((pg) => (
              <option key={pg.pgId} value={pg.pgId}>
                {pg.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => handleGetReviewsByPgId(pgIdForReviews)}
            disabled={!pgIdForReviews}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Get Reviews
          </button>

          {/* Show reviews below the button */}
          {reviews.length > 0 && (
            <div className="mt-4 bg-white p-5 border rounded max-h-[400px] overflow-y-auto">
              <h2 className="text-lg font-semibold mb-3">Reviews:</h2>
              {reviews.map((review) => (
                <div key={review.reviewId} className="border rounded p-3 mb-3">
                  <p>
                    <strong>Rating:</strong> {review.rating}
                  </p>
                  <p>
                    <strong>Comment:</strong> {review.comment}
                  </p>
                  <p>
                    <strong>Date:</strong> {review.feedbackDate}
                  </p>
                  <p>
                    <strong>User ID:</strong> {review.userId}
                  </p>
                  <p>
                    <strong>User Name:</strong> {review.userName}
                  </p>
                  <p>
                    <strong>PG ID:</strong> {review.pgPropertyid}
                  </p>
                  <p>
                    <strong>PG Name:</strong> {review.pgPropertyName}
                  </p>
                </div>
              ))}
            </div>
          )}

          {reviewError && <p className="text-red-600 mt-2">{reviewError}</p>}
        </div>
      )}

      {/* BOOKINGS */}
      {view === "getBookingsByPgId" && (
        <div className="p-4 bg-white rounded shadow mt-4">
          <h2 className="text-xl font-semibold mb-4">Bookings By PG</h2>

          {/* PG Dropdown */}
          <div className="mb-4">
            <label className="block font-medium mb-1">
              Select PG for Bookings:
            </label>
            <select
              className="border p-2 rounded w-full"
              value={pgIdForBookings}
              onChange={(e) => setPgIdForBookings(e.target.value)}
            >
              <option value="">Select PG</option>
              {pgList.map((pg) => (
                <option key={pg.pgId} value={pg.pgId}>
                  {pg.name}
                </option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {bookingError && (
              <p className="text-red-600 mb-2">{bookingError}</p>
            )}
            {bookings.length === 0 ? (
              <p>No bookings found.</p>
            ) : (
              <table className="min-w-full border border-gray-300 table-auto">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border">Booking ID</th>
                    <th className="px-4 py-2 border">Booking Date</th>
                    <th className="px-4 py-2 border">Status</th>
                    <th className="px-4 py-2 border">Check-In Date</th>
                    <th className="px-4 py-2 border">Check-Out Date</th>
                    <th className="px-4 py-2 border">Room ID</th>
                    <th className="px-4 py-2 border">PG Property ID</th>
                    <th className="px-4 py-2 border">PG Property Name</th>
                    <th className="px-4 py-2 border">User ID</th>
                    <th className="px-4 py-2 border">User Name</th>
                    <th className="px-4 py-2 border">Payment ID</th>
                    <th className="px-4 py-2 border">Amount</th>
                    <th className="px-4 py-2 border">Payment Status</th>
                    <th className="px-4 py-2 border">Payment Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.bookingId} className="text-center">
                      <td className="px-4 py-2 border">{booking.bookingId}</td>
                      <td className="px-4 py-2 border">
                        {booking.bookingDate
                          ? new Date(booking.bookingDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-4 py-2 border">
                        {booking.status || "N/A"}
                      </td>
                      <td className="px-4 py-2 border">
                        {booking.checkInDate
                          ? new Date(booking.checkInDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-4 py-2 border">
                        {booking.checkOutDate
                          ? new Date(booking.checkOutDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-4 py-2 border">
                        {booking.roomId || "N/A"}
                      </td>
                      <td className="px-4 py-2 border">
                        {booking.pgPropertId || "N/A"}
                      </td>
                      <td className="px-4 py-2 border">
                        {booking.pgPropertyName || "N/A"}
                      </td>
                      <td className="px-4 py-2 border">
                        {booking.userId || "N/A"}
                      </td>
                      <td className="px-4 py-2 border">
                        {booking.userName || "N/A"}
                      </td>
                      <td className="px-4 py-2 border">
                        {booking.paymentId || "N/A"}
                      </td>
                      <td className="px-4 py-2 border">
                        {booking.amount != null
                          ? booking.amount.toFixed(2)
                          : "N/A"}
                      </td>
                      <td className="px-4 py-2 border">
                        {booking.paymentStatus || "N/A"}
                      </td>
                      <td className="px-4 py-2 border">
                        {booking.paymentDate
                          ? new Date(booking.paymentDate).toLocaleString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {view === "getServicesByPgId" && (
        <div className="bg-white p-6 rounded shadow mt-6">
          <h2 className="text-xl font-bold mb-4 text-indigo-800">
            View Added Services
          </h2>

          {/* PG Dropdown */}
          <label className="block mb-2 font-medium text-gray-700">
            Select PG
          </label>
          <select
            className="border p-2 w-full rounded mb-6"
            value={selectedPgId}
            onChange={(e) => setSelectedPgId(e.target.value)}
          >
            <option value="">-- Select PG --</option>
            {pgList.map((pg) => (
              <option key={pg.pgId} value={pg.pgId}>
                {pg.name}
              </option>
            ))}
          </select>

          {/* Service List */}
          {servicesList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {servicesList.map((service) => (
                <div
                  key={service.serviceId}
                  className="border rounded-xl p-4 shadow-sm bg-gray-50"
                >
                  <p className="font-semibold text-indigo-700">
                    <span className="text-gray-600">Service ID:</span>{" "}
                    {service.serviceId}
                  </p>
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {service.serviceName}
                  </p>
                  <p>
                    <span className="font-medium">Description:</span>{" "}
                    {service.serviceDescription}
                  </p>
                  <p>
                    <span className="font-medium">Price:</span> ₹
                    {service.servicePrice.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-medium">PG:</span> {service.pgName}{" "}
                    (ID: {service.pgId})
                  </p>
                  <p>
                    <span className="font-medium">Room ID:</span>{" "}
                    {service.roomId || "N/A"}
                  </p>
                </div>
              ))}
            </div>
          ) : selectedPgId ? (
            <p className="mt-4 text-gray-600">No services found for this PG.</p>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;