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
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-800 text-white p-4 space-y-4">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <button
          onClick={() => setView("users")}
          className="w-full bg-blue-500 px-4 py-2 rounded"
        >
          Get Users
        </button>
        <button
          onClick={() => setView("owners")}
          className="w-full bg-yellow-500 px-4 py-2 rounded"
        >
          Get Owners
        </button>
        <button
          onClick={() => setView("addOwner")}
          className="w-full bg-purple-500 px-4 py-2 rounded"
        >
          Add Owner
        </button>
         <button
          onClick={() => setView("pgReviews")}
          className="w-full bg-purple-500 px-4 py-2 rounded"
        >
          Get Reviews
        </button>
        <button
          onClick={() => setView("pgBookings")}
          className="w-full bg-purple-500 px-4 py-2 rounded"
        >
          Get Bookings
        </button>
        <button
          onClick={handleLogout}
          className="w-full text-red-500 mt-4 px-4 py-2 border border-red-500 rounded"
        >
          Logout
        </button>
      </aside>
      <main className="flex-1 p-6">
        {/* Pass the current view to nested routes */}
        <Outlet context={{ view }} />
      </main>
    </div>
  );
};

export default AdminLayout;
