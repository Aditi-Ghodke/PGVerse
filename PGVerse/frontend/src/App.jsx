 import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Login from './pages/Login'
import UserLayout from "./layouts/UserLayout";
import OwnerLayout from "./layouts/OwnerLayout";
import AdminLayout from "./layouts/AdminLayout";

import UserDashboard from "./pages/user/UserDashboard";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

import NotFound from "./pages/NotFound";
import PrivateRoute from "./routes/PrivateRoute";



function App() {
  return (
    <>
     <BrowserRouter>
     <Routes>
      <Route path='/' element={<Login/>}></Route>
      {/* <Route path='/register' element={<Register/>}></Route> */}

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
             <OwnerLayout/>
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

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
     
     </BrowserRouter>
    </>
  )
}

export default App