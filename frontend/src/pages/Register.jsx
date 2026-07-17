import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        userName:"",
        email:"",
        password:"",
        confirmPassword:"",
    });

    const [errors, setErrors] = useState([]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]:e.target.value,
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        setErrors([]);

        if(formData.password !== formData.confirmPassword){
            return setErrors([{ msg: "Passwords do not match"}]);
        }

        try{
            const response = await registerUser(formData);
            navigate("/login");
        } catch(error){
            console.error(error.response?.data.message);
            const backendErrors = error.response?.data?.message;
            if (Array.isArray(backendErrors)){
                setErrors(backendErrors);
            } else {
                setErrors([
                    {
                        msg: "Registration Failed"
                    }
                ]);
            }
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
                 errors.length > 0 && (

                    <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
                        <ul className="list-disc list-inside space-y-1">
                            {errors.map((error, index) => (
                                <li key={index}> {error.msg} </li>
                            ))}
                        </ul>
                    </div>
                 )
                }

                <input
                type="text"
                name="userName"
                placeholder="user123"
                onChange={handleChange}
                className="w-full border p-3 rounded-lg mt-4 outline-none"
                />

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