//  import { BrowserRouter, Routes, Route } from "react-router-dom";
// import './App.css'
// import Login from './pages/Login'
// import UserLayout from "./layouts/UserLayout";
// import OwnerLayout from "./layouts/OwnerLayout";
// import AdminLayout from "./layouts/AdminLayout";

// import UserDashboard from "./pages/user/UserDashboard";
// import OwnerDashboard from "./pages/owner/OwnerDashboard";
// import AdminDashboard from "./pages/admin/AdminDashboard";

// import NotFound from "./pages/NotFound";
// import PrivateRoute from "./routes/PrivateRoute";



// function App() {
//   return (
//     <>
//      <BrowserRouter>
//      <Routes>
//       <Route path='/' element={<Login/>}></Route>

//        {/* User Routes */}
//         <Route
//           path="/user/*"
//           element={
//             <PrivateRoute allowedRole="USER">
//               <UserLayout />
//             </PrivateRoute>
//           }
//         >
//           <Route path="dashboard" element={<UserDashboard />} />
//         </Route>

//         {/* Owner Routes */}
//         <Route
//           path="/owner/*"
//           element={
//             <PrivateRoute allowedRole="OWNER">
//              <OwnerLayout/>
//             </PrivateRoute>
//           }
//         >
//           <Route path="dashboard" element={<OwnerDashboard />} />
//         </Route>

//         {/* Admin Routes */}
//         <Route
//           path="/admin/*"
//           element={
//             <PrivateRoute allowedRole="ADMIN">
//               <AdminLayout />
//             </PrivateRoute>
//           }
//         >
//           <Route path="dashboard" element={<AdminDashboard />} />
//         </Route>

//         {/* Fallback Route */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>
     
//      </BrowserRouter>
//     </>
//   )
// }

// export default App



import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'

import Register from '../src/pages/Register'
import Login from './pages/Login'
import LandingPage from "../src/pages/LandingPage";
import HomePage from '../src/pages/Home'
import PgDetailsPage from '../src/pages/PgDetailsPage'

import UserLayout from "./layouts/UserLayout";
import OwnerLayout from "./layouts/OwnerLayout";
import AdminLayout from "./layouts/AdminLayout";

import UserDashboard from "./pages/user/UserDashboard";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

import NotFound from "./pages/NotFound";
import PrivateRoute from "./routes/PrivateRoute";
import Navbar from "./components/Navbar";
import AboutUs from "./components/AboutUs";
import PGList from "./components/PGList";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <BrowserRouter>
      <Navbar />
        <Routes>
        
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          {/* <Route path="/home" element={<HomePage />} /> */}
          <Route path="/pglist" element={<PGList />} />
          <Route path="/about" element={<AboutUs />} />
           <Route path="/register" element={<Register />} />
          <Route path="/pg/:pgId" element={<PgDetailsPage />} />
          <Route
            path="/login"
            element={
              <div className="flex items-center justify-center min-h-screen ">
                <Login />
              </div>
            }
          />

          {/* User Routes */}
          <Route
            path="/user/*"
            element={
              <PrivateRoute allowedRole="USER">
                <UserLayout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<UserDashboard />} />
          </Route>

          {/* Owner Routes */}
          <Route
            path="/owner/*"
            element={
              <PrivateRoute allowedRole="OWNER">
                <OwnerLayout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<OwnerDashboard />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <PrivateRoute allowedRole="ADMIN">
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>

          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
