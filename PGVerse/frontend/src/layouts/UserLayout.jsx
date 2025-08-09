import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import UserDashboard from "../pages/user/UserDashboard";

const UserLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState("getUser"); // default view

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    // <div className="min-h-screen flex">
    //   <aside className="w-64 bg-gray-800 text-white p-4 space-y-4">
    //     <h2 className="text-xl font-bold mb-4">User Panel</h2>
    //     <nav className="space-y-2">
    //       <button
    //         onClick={() => setView("getUser")}
    //         className="w-full bg-yellow-500 px-4 py-2 rounded"
    //       >
    //         Get User Details
    //       </button>
    //        <button
    //         onClick={() => setView("changePassword")}
    //         className="w-full bg-green-600 text-white px-4 py-2 rounded mb-2"
    //       >
    //         Change Password
    //       </button>

    //        <button
    //         onClick={() => setView("updateUser")}
    //         className="w-full bg-blue-500 px-4 py-2 rounded"          >
    //         Update Profile
    //       </button>

    //      <button
    //         onClick={() => setView("getBookings")}
    //         className="w-full bg-indigo-500 px-4 py-2 rounded"
    //       >
    //         My Bookings
    //       </button>

    //      <button
    //       onClick={() => setView("getUserReviews")}
    //       className="w-full bg-pink-500 px-4 py-2 rounded"        >
    //       My Reviews
    //     </button>

    //      {/* <button
    //         onClick={() => setView("addReview")}
    //         className="w-full bg-green-600 text-white px-4 py-2 rounded"
    //       >
    //         Add Review
    //       </button> */}

    //       {/* <button
    //         onClick={() => setView("requestService")}
    //         className="w-full bg-green-600 text-white px-4 py-2 rounded"
    //       >
    //         Request Service
    //       </button> */}

    //       <button
    //         onClick={handleLogout}
    //         className="w-full text-red-500 mt-4 px-4 py-2 border border-red-500 rounded"
    //       >
    //         Logout
    //       </button>

    //     </nav>
    //   </aside>
    //   <main className="flex-1 p-6">
    //     <UserDashboard view={view} />
    //   </main>
    // </div>
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col space-y-6 shadow-lg">
        <h2 className="text-2xl font-extrabold tracking-wide border-b border-gray-700 pb-4">
          User Panel
        </h2>

        <nav className="flex flex-col space-y-3 flex-1">
          {[
            {
              label: "Get User Details",
              viewKey: "getUser",
              bg: "bg-yellow-500",
              text: "text-white",
            },
            {
              label: "Change Password",
              viewKey: "changePassword",
              bg: "bg-green-600",
              text: "text-white",
            },
            {
              label: "Update Profile",
              viewKey: "updateUser",
              bg: "bg-blue-600",
              text: "text-white",
            },
            {
              label: "My Bookings",
              viewKey: "getBookings",
              bg: "bg-indigo-600",
              text: "text-white",
            },
            {
              label: "My Reviews",
              viewKey: "getUserReviews",
              bg: "bg-pink-600",
              text: "text-white",
            },
          ].map(({ label, viewKey, bg, text }) => (
            <button
              key={viewKey}
              onClick={() => setView(viewKey)}
              className={`
            w-full py-3 rounded-md font-semibold
            ${view === viewKey ? `${bg} shadow-lg` : `bg-gray-700 hover:${bg}`}
            ${text} transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-${
              bg.split("-")[1]
            }-400
          `}
            >
              {label}
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="w-full mt-auto py-3 rounded-md font-semibold text-red-500 border border-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400"
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-8 bg-white shadow-inner rounded-lg mx-6 my-6">
        <UserDashboard view={view} />
      </main>
    </div>
  );
};

export default UserLayout;
