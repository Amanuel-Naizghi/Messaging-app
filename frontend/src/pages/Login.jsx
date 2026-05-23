import { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
    
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrorMessage("");

        try {
            const data = await loginUser(formData);
            
            console.log(data);

            setUser(true);

            navigate("/");

        } catch (error) {
            console.log(error.response.data);

            setErrorMessage(
                error.response?.data?.error || "Invalid email or password"
            );

            
        };
    }

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">

            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-lg w-[400px]"
            >

                <h1 className="text-3xl font-bold mb-6 text-center">
                Login
                </h1>

                {
                errorMessage && (
                    <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
                    {errorMessage}
                    </div>
                )
                }

                <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                className="w-full border p-3 rounded-lg mb-4 outline-none"
                />

                <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full border p-3 rounded-lg mb-6 outline-none"
                />

                <button
                className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
                >
                Login
                </button>

                <p className="mt-4 text-center">
                No account?{" "}
                <Link
                    to="/register"
                    className="text-blue-500"
                >
                    Register
                </Link>
                </p>

            </form>

        </div>
    );
}

export default Login;