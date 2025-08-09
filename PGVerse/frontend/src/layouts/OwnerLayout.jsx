import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { manuallyUpdateBookings } from "../api/ownerApi"; // adjust path as needed

const OwnerLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Manage which section to show
  const [view, setView] = useState("dashboard"); // default section

  const handleManuallyUpdateBookings = async () => {
    try {
      const token = localStorage.getItem("token"); // or use from context
      await manuallyUpdateBookings(token);
      alert("Booking statuses updated successfully!");
    } catch (error) {
      console.error("Error updating bookings:", error);
      alert("Failed to update booking statuses.");
    }
  };

  return (
    //     <div className="min-h-screen flex">
    //       <aside className="w-64 bg-gray-800 text-white p-4 space-y-4">
    //         <h2 className="text-xl font-bold mb-4">Owner Panel</h2>

    //         <button
    //           onClick={() => setView("dashboard")}
    //           className="w-full bg-blue-500 px-4 py-2 rounded"
    //         >
    //           Dashboard
    //         </button>

    //         <button
    //           onClick={() => setView("editOwner")}
    //             className="w-full bg-yellow-500 px-4 py-2 rounded"
    //         >
    //           Edit Owner Details
    //         </button>

    //         <button
    //           onClick={() => setView("changePassword")}
    //           className="w-full bg-purple-500 px-4 py-2 rounded"
    //         >
    //           Change Password
    //         </button>

    //         <button
    //           onClick={() => setView("managePG")}
    //           className="w-full bg-blue-500 px-4 py-2 rounded"
    //         >
    //           Manage PG Properties
    //         </button>

    //         <button
    //             onClick={() => setView("getPgByOwnerId")}
    //             className="w-full bg-indigo-500 px-4 py-2 rounded"
    //             >
    //             View All PGs
    //         </button>
    // {/*
    //             <button
    //             onClick={() => setView("getPgById")}
    //             className="w-full bg-pink-500 px-4 py-2 rounded"
    //             >
    //             View PG By ID
    //         </button> */}

    //         <button
    //           onClick={() => setView("addRoom")}
    //           className="w-full bg-green-600 text-white px-4 py-2 rounded"
    //         >
    //           Add Room
    //         </button>

    //       {/* <button
    //         onClick={() => setView("updateRoom")}
    //         className="w-full bg-yellow-500 text-white px-4 py-2 rounded mt-2"
    //       >
    //         Update Room
    //       </button> */}

    //       <button
    //         onClick={() => setView("getAllRooms")}
    //         className="w-full bg-indigo-500 text-white px-4 py-2 rounded"
    //       >
    //         View All Rooms in PG
    //       </button>

    //        {/* <button
    //         onClick={() => setView("addService")}
    //         className="w-full bg-green-600 text-white px-4 py-2 rounded"
    //       >
    //         Add Service
    //       </button> */}

    //       {/* <button
    //         onClick={() => setView("getRequestedServicesByPgId")}
    //         className="w-full bg-indigo-600 text-white px-4 py-2 rounded"
    //       >
    //         View Requested Services
    //       </button>

    //       <button
    //         onClick={() => setView("getServicesByPgId")}
    //         className="w-full bg-indigo-600 text-white px-4 py-2 rounded"
    //       >
    //         View All Services
    //       </button> */}

    //       {/* Button to get reviews */}
    //       <button
    //         onClick={() => setView("getReviewsByPgId")}
    //         className="w-full bg-purple-600 text-white px-4 py-2 rounded mb-2"
    //       >
    //         View Reviews
    //       </button>

    //       {/* Button to get bookings */}
    //       <button
    //         onClick={() => setView("getBookingsByPgId")}
    //         className="w-full bg-blue-600 text-white px-4 py-2 rounded mb-2"
    //       >
    //         View Bookings
    //       </button>

    //       {/* Button to manually update bookings */}
    //       <button
    //         onClick={handleManuallyUpdateBookings}
    //         className="w-full bg-green-600 text-white px-4 py-2 rounded mb-2"
    //       >
    //         Update Bookings Status
    //       </button>

    //         <button
    //           onClick={handleLogout}
    //           className="w-full text-red-500 mt-4 px-4 py-2 border border-red-500 rounded"
    //         >
    //           Logout
    //         </button>
    //       </aside>

    //       <main className="flex-1 p-2">
    //         {/* Pass the selected view to child routes/components */}
    //         <Outlet context={{ view }} />
    //       </main>
    //     </div>
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col space-y-6 shadow-lg">
        <h2 className="text-2xl font-extrabold tracking-wide border-b border-gray-700 pb-4">
          Owner Panel
        </h2>

        <nav className="flex flex-col space-y-3 flex-1">
          {[
            { label: "Dashboard", viewKey: "dashboard", bg: "bg-blue-600" },
            {
              label: "Edit Owner Details",
              viewKey: "editOwner",
              bg: "bg-yellow-500",
            },
            {
              label: "Change Password",
              viewKey: "changePassword",
              bg: "bg-purple-600",
            },
            {
              label: "Manage PG Properties",
              viewKey: "managePG",
              bg: "bg-blue-600",
            },
            {
              label: "View All PGs",
              viewKey: "getPgByOwnerId",
              bg: "bg-indigo-600",
            },
            { label: "Add Room", viewKey: "addRoom", bg: "bg-green-600" },
            {
              label: "View All Rooms in PG",
              viewKey: "getAllRooms",
              bg: "bg-indigo-600",
              textColor: "text-white",
            },
            {
              label: "View Reviews",
              viewKey: "getReviewsByPgId",
              bg: "bg-purple-600",
            },
            {
              label: "View Bookings",
              viewKey: "getBookingsByPgId",
              bg: "bg-blue-600",
            },
          ].map(({ label, viewKey, bg, textColor }) => (
            <button
              key={viewKey}
              onClick={() => setView(viewKey)}
              className={`
            w-full py-3 rounded-md font-semibold
            ${
              view === viewKey
                ? `${bg} shadow-lg text-white`
                : `bg-gray-700 hover:${bg} hover:shadow-lg ${
                    textColor || "text-white"
                  }`
            }
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-${
              bg.split("-")[1]
            }-400
          `}
            >
              {label}
            </button>
          ))}

          <button
            onClick={handleManuallyUpdateBookings}
            className="w-full py-3 rounded-md font-semibold bg-green-600 text-white hover:bg-green-700 shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-400"
          >
            Update Bookings Status
          </button>

          <button
            onClick={handleLogout}
            className="w-full mt-auto py-3 rounded-md font-semibold text-red-500 border border-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400"
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-8 bg-white shadow-inner rounded-lg mx-6 my-6">
        {/* Pass the selected view to child routes/components */}
        <Outlet context={{ view }} />
      </main>
    </div>
  );
};

export default OwnerLayout;
