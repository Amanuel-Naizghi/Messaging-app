import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName:"",
        lastName:"",
        email:"",
        password:"",
        confirmPassword:"",
    });

    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]:e.target.value,
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        setErrorMessage("");

        if(formData.password !== formData.confirmPassword){
            return setErrorMessage("Passwords do not match");
        }

        try{
            const response = await registerUser(formData);
            console.log(response);
            navigate("/login");
        } catch(error){
            console.log(error.response?.data);
            setErrorMessage(
                error.response?.data?.error || "Registration Failed"
            );
        }
    }

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">

            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-lg w-[450px]"
            >

                <h1 className="text-3xl font-bold mb-6 text-center">
                Create Account
                </h1>

                {
                errorMessage && (
                    <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
                    {errorMessage}
                    </div>
                )
                }

                <div className="grid grid-cols-2 gap-4">

                <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    onChange={handleChange}
                    className="border p-3 rounded-lg outline-none"
                />

                <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    onChange={handleChange}
                    className="border p-3 rounded-lg outline-none"
                />

                </div>

                <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                className="w-full border p-3 rounded-lg mt-4 outline-none"
                />

                <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full border p-3 rounded-lg mt-4 outline-none"
                />

                <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                onChange={handleChange}
                className="w-full border p-3 rounded-lg mt-4 outline-none"
                />

                <button
                className="w-full bg-blue-500 text-white p-3 rounded-lg mt-6 hover:bg-blue-600"
                >
                Register
                </button>

                <p className="mt-4 text-center">
                Already have an account?{" "}
                <Link
                    to="/login"
                    className="text-blue-500"
                >
                    Login
                </Link>
                </p>

            </form>

        </div>
    );
}

export default Register;