import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Manage which view the dashboard should show
  const [view, setView] = useState("dashboard"); // default view

  return (
    // <div className="min-h-screen flex">
    //   <aside className="w-64 bg-gray-800 text-white p-4 space-y-4">
    //     <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
    //     <button
    //       onClick={() => setView("users")}
    //       className="w-full bg-blue-500 px-4 py-2 rounded"
    //     >
    //       Get Users
    //     </button>
    //     <button
    //       onClick={() => setView("owners")}
    //       className="w-full bg-yellow-500 px-4 py-2 rounded"
    //     >
    //       Get Owners
    //     </button>
    //     <button
    //       onClick={() => setView("addOwner")}
    //       className="w-full bg-purple-500 px-4 py-2 rounded"
    //     >
    //       Add Owner
    //     </button>
    //      <button
    //       onClick={() => setView("pgReviews")}
    //       className="w-full bg-purple-500 px-4 py-2 rounded"
    //     >
    //       Get Reviews
    //     </button>
    //     <button
    //       onClick={() => setView("pgBookings")}
    //       className="w-full bg-purple-500 px-4 py-2 rounded"
    //     >
    //       Get Bookings
    //     </button>
    //     <button
    //       onClick={handleLogout}
    //       className="w-full text-red-500 mt-4 px-4 py-2 border border-red-500 rounded"
    //     >
    //       Logout
    //     </button>
    //   </aside>
    //   <main className="flex-1 p-6">
    //     {/* Pass the current view to nested routes */}
    //     <Outlet context={{ view }} />
    //   </main>
    // </div>
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col space-y-6 shadow-lg">
        <h2 className="text-2xl font-extrabold tracking-wide border-b border-gray-700 pb-4">
          Admin Panel
        </h2>

        <nav className="flex flex-col space-y-3 flex-1">
          {[
            { label: "Get Users", viewKey: "users", bg: "bg-blue-600" },
            {
              label: "Get Owners",
              viewKey: "owners",
              bg: "bg-yellow-500",
              textColor: "text-white",
            },
            { label: "Add Owner", viewKey: "addOwner", bg: "bg-purple-600" },
            { label: "Get Reviews", viewKey: "pgReviews", bg: "bg-purple-600" },
            {
              label: "Get Bookings",
              viewKey: "pgBookings",
              bg: "bg-purple-600",
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
            onClick={handleLogout}
            className="w-full mt-auto py-3 rounded-md font-semibold text-red-500 border border-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400"
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-8 bg-white shadow-inner rounded-lg mx-6 my-6">
        {/* Pass the current view to nested routes */}
        <Outlet context={{ view }} />
      </main>
    </div>
  );
};

export default AdminLayout;
