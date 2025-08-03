// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useState } from "react";

// const UserLayout = () => {
//   const { logout } = useAuth();
//   const navigate = useNavigate();
//   const [view, setView] = useState("dashboard");

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//   };

//   return (
//     <div className="min-h-screen flex">
//       {/* Sidebar */}
//      <aside className="w-64 bg-gray-800 text-white p-4 space-y-4">
//          <h2 className="text-xl font-bold mb-4">User Panel</h2>
//         <nav className="space-y-2">
//           <button 
//                 onClick={() => setView("dashboard")} 
//                 className="w-full bg-blue-500 px-4 py-2 rounded"
//             >
//             Dashboard
//            </button>

          {/*<button 
            onClick={() => setView("getUser")} 
            className="w-full bg-yellow-500 px-4 py-2 rounded"
          >
            Get User Details
          </button>

          <button 
            onClick={() => setView("updateUser")} 
            className="w-full bg-green-600 text-white px-4 py-2 rounded mb-2"
          >
            Update User
          </button>

          <button 
            onClick={() => setView("changePassword")} 
            className="w-full bg-yellow-500 px-4 py-2 rounded"
          >
            Change Password
          </button>

          <button 
            onClick={() => setView("deleteUser")} 
            className="w-full bg-blue-500 px-4 py-2 rounded"
          >
            Delete User
          </button>

          <button 
          onClick={() => setView("addReview")} 
          className="w-full bg-indigo-500 px-4 py-2 rounded"
          >
            Add Review
          </button>

          <button 
            onClick={() => setView("updateReview")} 
            className="w-full bg-pink-500 px-4 py-2 rounded"
          >
            Update Review
          </button>

          <button 
          onClick={() => setView("deleteReview")} 
          className="w-full bg-green-600 text-white px-4 py-2 rounded"
          >
            Delete Review
          </button>

          <button 
            onClick={() => setView("getMyReviews")} 
            className="w-full bg-yellow-500 text-white px-4 py-2 rounded mt-2"
          >
            View My Reviews
          </button>

          <button 
            onClick={() => setView("makeBooking")} 
            className="w-full bg-indigo-500 text-white px-4 py-2 rounded"
          >
            Make Booking
          </button>

          <button 
            onClick={() => setView("getBookings")} 
            className="w-full bg-pink-500 text-white px-4 py-2 rounded"
          >
            Get My Bookings
          </button>

          <button 
          onClick={() => setView("getBookingById")} 
          className="w-full bg-red-500 text-white px-4 py-2 rounded"
          >
            Get Booking by ID
          </button>

          <button 
            onClick={() => setView("cancelBooking")} 
            className="w-full bg-green-600 text-white px-4 py-2 rounded"
          >
            Cancel Booking
          </button>

          <button 
          onClick={() => setView("updateBookingStatus")} 
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Update Booking Statuses
          </button>

          <button 
            onClick={() => setView("requestService")} 
            className="w-full bg-purple-600 text-white px-4 py-2 rounded mb-2"
          >
            Request Service
          </button> */}

//           <button 
//           onClick={handleLogout} 
//           className="w-full text-red-500 mt-4 px-4 py-2 border border-red-500 rounded"
//           >
//             Logout
//           </button>
//         </nav>
//       </aside>

      
//     </div>
//   );
// };

// export default UserLayout;





// import { Outlet, Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const UserLayout = () => {
//     const { logout } = useAuth();
//     const navigate = useNavigate();

//     const handleLogout = () => {
//         logout();
//         navigate("/");
//     };

//     return (
//         <div className="min-h-screen flex">
//             <aside className="w-64 bg-gray-800 text-white p-4 space-y-4">
//                 <h2 className="text-xl font-bold mb-4">User Panel</h2>
//                 <nav className="space-y-2">
//                     <Link to="/user/dashboard">Dashboard</Link>
//                     <button className="block bg-blue-500 text-white px-3 py-1 rounded mt-4">
//                         Get User Details
//                     </button>
//                     <button onClick={handleLogout} className="block text-red-500 mt-4">
//                         Logout
//                     </button>
//                 </nav>
//             </aside>
//             <main className="flex-1 p-6">
//                 <Outlet />
//             </main>
//         </div>
//     );
// };

// export default UserLayout;


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
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-4">User Panel</h2>
        <nav className="space-y-2">
          <button
            onClick={() => setView("getUser")}
            className="block bg-blue-500 text-white px-3 py-1 rounded"
          >
            Get User Details
          </button>
           <button
            onClick={() => setView("changePassword")}
            className="block bg-green-600 text-white px-3 py-1 rounded mt-2"
          >
            Change Password
          </button>

           <button
            onClick={() => setView("updateUser")}
            className="block bg-green-600 text-white px-3 py-1 rounded mt-2"
          >
            Update Profile
          </button>

         <button
            onClick={() => setView("getBookings")}
            className="block bg-purple-600 text-white px-3 py-1 rounded mt-2"
          >
            My Bookings
          </button>

         <button
          onClick={() => setView("getUserReviews")}
          className="block bg-purple-600 text-white px-3 py-1 rounded mt-2"
        >
          My Reviews
        </button>

         <button
            onClick={() => setView("addReview")}
            className="block bg-purple-600 text-white px-3 py-1 rounded mt-2"
          >
            Add Review
          </button>


          <button
            onClick={handleLogout}
            className="block text-red-500 mt-4"
          >
            Logout
          </button>
          
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <UserDashboard view={view} />
      </main>
    </div>
  );
};

export default UserLayout;
