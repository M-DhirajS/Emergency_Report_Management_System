import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";
import Input from "../components/common/Input";

/**
 * Registration page with full form validation.
 * On success, automatically logs in the user with the returned JWT token.
 */
function Register() {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        setError("");
        setLoading(true);

        // Validation
        if (!formData.fullName || !formData.email || !formData.mobile || !formData.password || !formData.confirmPassword) {
            setError("Please fill all fields");
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        try {

            const response = await api.post("/register", {
                fullName: formData.fullName,
                email: formData.email,
                mobile: formData.mobile,
                password: formData.password,
            });

            const { token, id, fullName, role } = response.data;

            // Auto login after registration
            login({ id, fullName, email: formData.email, mobile: formData.mobile, role }, token);

            navigate("/dashboard");

        } catch (error: any) {
            const message = error.response?.data?.error || "Registration failed";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-5">
            <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8">

                <h1 className="text-4xl font-bold text-center text-red-600 mb-2">
                    Create Account
                </h1>

                <p className="text-center text-gray-500 mb-8">
                    Register to continue
                </p>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    <Input
                        label="Full Name"
                        name="fullName"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleChange}
                    />

                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <Input
                        label="Mobile Number"
                        name="mobile"
                        placeholder="Enter mobile number"
                        value={formData.mobile}
                        onChange={handleChange}
                    />

                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        placeholder="Create password (min 6 chars)"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <Input
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />

                    <Button
                        text={loading ? "Creating Account..." : "Register"}
                        type="submit"
                        disabled={loading}
                    />

                </form>

                <p className="text-center mt-6">
                    Already have an account?
                    <Link
                        to="/login"
                        className="text-red-600 font-semibold ml-2"
                    >
                        Login
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Register;

