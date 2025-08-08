// import { useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await axios.post("http://localhost:8080/auth/login", {
//         email,
//         password,
//       });

//       const { token, role, name, id } = res.data;

//       login({ token, role, name, id, email });

//       // Save user info to localStorage
//       localStorage.setItem("token", token);
//       localStorage.setItem("id", id);
//       localStorage.setItem("userId", id); 
//       localStorage.setItem("name", name);
//       localStorage.setItem("email", email);

//       // Check if user was redirected from a protected route
//       const redirectPath = sessionStorage.getItem("redirectAfterLogin");

//       if (redirectPath) {
//         sessionStorage.removeItem("redirectAfterLogin");
//         navigate(redirectPath);
//       } else {
//         // Navigate based on role
//         if (role === "USER") navigate("/user/dashboard");
//         else if (role === "OWNER") navigate("/owner/dashboard");
//         else if (role === "ADMIN") navigate("/admin/dashboard");
//         else navigate("/"); // fallback
//       }
//     } catch (err) {
//       alert("Login failed");
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="p-4 max-w-md mx-auto mt-10 space-y-4"
//     >
//       <input
//         type="email"
//         placeholder="Email"
//         className="w-full p-2 border rounded"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         required
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         className="w-full p-2 border rounded"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         required
//       />
//       <button
//         type="submit"
//         className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//       >
//         Login
//       </button>
//        <p className="text-center text-sm text-gray-600">
//         Don't have an account?{" "}
//         <Link to="/register" className="text-blue-500 hover:underline">
//           Register here
//         </Link>
//       </p>
//     </form>
//   );
// };

// export default Login;


import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", password: "", general: "" };

    // Email validation
    if (!email) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
      valid = false;
    }

    // Password validation (only required, no length check)
    if (!password) {
      newErrors.password = "Password is required.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const res = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });

      const { token, role, name, id } = res.data;

      login({ token, role, name, id, email });

      localStorage.setItem("token", token);
      localStorage.setItem("id", id);
      localStorage.setItem("userId", id);
      localStorage.setItem("name", name);
      localStorage.setItem("email", email);

      const redirectPath = sessionStorage.getItem("redirectAfterLogin");
      if (redirectPath) {
        sessionStorage.removeItem("redirectAfterLogin");
        navigate(redirectPath);
      } else {
        if (role === "USER") navigate("/user/dashboard");
        else if (role === "OWNER") navigate("/owner/dashboard");
        else if (role === "ADMIN") navigate("/admin/dashboard");
        else navigate("/");
      }
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        general: "Invalid email or password. Please try again.",
      }));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 space-y-6 border border-gray-300 bg-white rounded-lg shadow-sm"
      >
        <h1 className="text-3xl font-bold text-center text-indigo-600">Login</h1>

        {/* Email Input */}
        <div>
          <input
            type="email"
            placeholder="Email"
            className={`w-full p-3 text-lg border rounded focus:outline-none ${
              errors.email ? "border-red-500" : "border-gray-400"
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <input
            type="password"
            placeholder="Password"
            className={`w-full p-3 text-lg border rounded focus:outline-none ${
              errors.password ? "border-red-500" : "border-gray-400"
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        {/* General error */}
        {errors.general && (
          <p className="text-center text-red-600">{errors.general}</p>
        )}

        <button
          type="submit"
          className="w-full py-3 text-lg font-semibold text-white bg-indigo-600 rounded hover:bg-gray-600 transition duration-300"
        >
          Login
        </button>

        <p className="text-center text-base text-gray-700">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold underline hover:text-gray-900"
          >
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
