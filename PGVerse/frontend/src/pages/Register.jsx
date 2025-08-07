// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import authService from "e"; // adjust path if needed

// const Register = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "", 
//   });

//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const response = await authService.register(formData);
//       if (response.status === 200 || response.status === 201) {
//         navigate("/"); // redirect to login
//       }
//     } catch (err) {
//       setError("Registration failed. Try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form onSubmit={handleRegister} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

//         {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

//         <div className="mb-4">
//           <label className="block text-gray-700 mb-1">Name</label>
//           <input
//             type="text"
//             name="name"
//             required
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-md"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700 mb-1">Email</label>
//           <input
//             type="email"
//             name="email"
//             required
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-md"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700 mb-1">Password</label>
//           <input
//             type="password"
//             name="password"
//             required
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-md"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700 mb-1">Phone</label>
//           <input
//             type="tel"
//             name="phone"
//             required
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-md"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700 mb-1">Gender</label>
//           <input
//             type="text"
//             name="gender"
//             required
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-md"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700 mb-1">Address</label>
//           <input
//             type="text"
//             name="address"
//             required
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-md"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700 mb-1">Aadhar Card</label>
//           <input
//             type="text"
//             name="card"
//             required
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-md"
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
//         >
//           Register
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Register;
import { useState } from "react";
import { registerUser } from "../api/userApi"; // adjust the path as needed
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    address: "",
    card: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerUser(formData);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Registration failed. Please check your inputs and try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 max-w-md mx-auto mt-10 space-y-4"
    >
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        className="w-full p-2 border rounded"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full p-2 border rounded"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="w-full p-2 border rounded"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="phone"
        placeholder="Phone Number"
        className="w-full p-2 border rounded"
        value={formData.phone}
        onChange={handleChange}
        required
      />
      <select
        name="gender"
        className="w-full p-2 border rounded"
        value={formData.gender}
        onChange={handleChange}
        required
      >
        <option value="">Select Gender</option>
        <option value="MALE">Male</option>
        <option value="FEMALE">Female</option>
        <option value="OTHER">Other</option>
      </select>
      <input
        type="text"
        name="address"
        placeholder="Address"
        className="w-full p-2 border rounded"
        value={formData.address}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="card"
        placeholder="Aadhar Card Number"
        className="w-full p-2 border rounded"
        value={formData.card}
        onChange={handleChange}
        required
      />
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Register
      </button>
    </form>
  );
};

export default Register;

