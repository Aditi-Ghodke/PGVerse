// import { useState } from "react";
// import { registerUser } from "../api/userApi"; // adjust the path as needed
// import { useNavigate } from "react-router-dom";

// const Register = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     phone: "",
//     gender: "",
//     address: "",
//     card: "",
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await registerUser(formData);
//       alert("Registration successful! Please login.");
//       navigate("/login");
//     } catch (err) {
//       console.error(err);
//       alert("Registration failed. Please check your inputs and try again.");
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="p-4 max-w-md mx-auto mt-10 space-y-4"
//     >
//       <input
//         type="text"
//         name="name"
//         placeholder="Full Name"
//         className="w-full p-2 border rounded"
//         value={formData.name}
//         onChange={handleChange}
//         required
//       />
//       <input
//         type="email"
//         name="email"
//         placeholder="Email"
//         className="w-full p-2 border rounded"
//         value={formData.email}
//         onChange={handleChange}
//         required
//       />
//       <input
//         type="password"
//         name="password"
//         placeholder="Password"
//         className="w-full p-2 border rounded"
//         value={formData.password}
//         onChange={handleChange}
//         required
//       />
//       <input
//         type="text"
//         name="phone"
//         placeholder="Phone Number"
//         className="w-full p-2 border rounded"
//         value={formData.phone}
//         onChange={handleChange}
//         required
//       />
//       <select
//         name="gender"
//         className="w-full p-2 border rounded"
//         value={formData.gender}
//         onChange={handleChange}
//         required
//       >
//         <option value="">Select Gender</option>
//         <option value="MALE">Male</option>
//         <option value="FEMALE">Female</option>
//         <option value="OTHER">Other</option>
//       </select>
//       <input
//         type="text"
//         name="address"
//         placeholder="Address"
//         className="w-full p-2 border rounded"
//         value={formData.address}
//         onChange={handleChange}
//         required
//       />
//       <input
//         type="text"
//         name="card"
//         placeholder="Aadhar Card Number"
//         className="w-full p-2 border rounded"
//         value={formData.card}
//         onChange={handleChange}
//         required
//       />
//       <button
//         type="submit"
//         className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//       >
//         Register
//       </button>
//     </form>
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

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    let tempErrors = {};

    if (!formData.name.trim()) {
      tempErrors.name = "Full Name is required";
    }

    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Invalid email format";
    }

    if (!formData.password.trim()) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.phone.trim()) {
      tempErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      tempErrors.phone = "Phone number must be 10 digits";
    }

    if (!formData.gender) {
      tempErrors.gender = "Gender is required";
    }

    // No validation for address as per your request

    if (!formData.card.trim()) {
      tempErrors.card = "Aadhar card number is required";
    } else if (!/^\d{12}$/.test(formData.card)) {
      tempErrors.card = "Aadhar number must be 12 digits";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

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
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-8 space-y-6 bg-white rounded-2xl shadow-lg"
      >
        <h1 className="text-3xl font-bold text-center text-indigo-600">
          Create Your Account
        </h1>

        {/* Full Name */}
        <div>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            className="w-full p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone}</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <select
            name="gender"
            className="w-full p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-sm">{errors.gender}</p>
          )}
        </div>

        {/* Address  */}
        <input
          type="text"
          name="address"
          placeholder="Address"
          className="w-full p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={formData.address}
          onChange={handleChange}
        />

        {/* Aadhar */}
        <div>
          <input
            type="text"
            name="card"
            placeholder="Aadhar Card Number"
            className="w-full p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={formData.card}
            onChange={handleChange}
          />
          {errors.card && (
            <p className="text-red-500 text-sm">{errors.card}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg hover:bg-gray-600 transition duration-300"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
