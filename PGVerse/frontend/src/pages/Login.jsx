// import { useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const { login } = useAuth();
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             const res = await axios.post("http://localhost:8080/auth/login", {
//                 email,
//                 password,
//             });

//             const { token, role, name } = res.data;

//             login({ token, role, name });

//             // Navigate based on role
//             if (role === "USER") navigate("/user/dashboard");
//             else if (role === "OWNER") navigate("/owner/dashboard");
//             else if (role === "ADMIN") navigate("/admin/dashboard");
//             else navigate("/"); // Fallback

//         } catch (err) {
//             alert("Login failed");
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto mt-10 space-y-4">
//             <input
//                 type="email"
//                 placeholder="Email"
//                 className="w-full p-2 border"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//             />
//             <input
//                 type="password"
//                 placeholder="Password"
//                 className="w-full p-2 border"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//             />
//             <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
//                 Login
//             </button>
//         </form>
//     );
// };

// export default Login;





import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:8080/auth/login", {
                email,
                password,
            });

            const { token, role, name, id } = res.data;

            login({ token, role, name, id, email});

            localStorage.setItem("token", token);
            localStorage.setItem("id", id);
            localStorage.setItem("name", name);
            localStorage.setItem("email", email);


            // Navigate based on role
            if (role === "USER") navigate("/user/dashboard");
            else if (role === "OWNER") navigate("/owner/dashboard");
            else if (role === "ADMIN") navigate("/admin/dashboard");
            else navigate("/"); // Fallback

        } catch (err) {
            alert("Login failed");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto mt-10 space-y-4">
            <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                className="w-full p-2 border"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Login
            </button>
        </form>
    );
};

export default Login;




