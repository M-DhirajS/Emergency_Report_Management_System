import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";
import Input from "../components/common/Input";

/**
 * Login page with email/password authentication.
 * On success, stores JWT token and user data, then redirects based on role.
 */
function Login() {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        setError("");
        setLoading(true);

        if (!email || !password) {
            setError("Please fill all fields");
            setLoading(false);
            return;
        }

        try {

            const response = await api.post("/login", { email, password });

            const { token, id, fullName, role, mobile, profilePicture } = response.data;

            // Store in auth context
            login({
                id,
                fullName,
                email,
                mobile,
                role,
                profilePicture
            }, token);

            // Redirect based on role
            if (role === "ADMIN") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }

        } catch (error: any) {
            const message = error.response?.data?.error || "Invalid email or password";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-5">

            <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8">

                <h1 className="text-4xl font-bold text-center text-red-600 mb-2">
                    Welcome Back
                </h1>

                <p className="text-center text-gray-500 mb-8">
                    Login to your account
                </p>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button
                        text={loading ? "Logging in..." : "Login"}
                        type="submit"
                        disabled={loading}
                    />

                </form>

                <div className="text-center mt-4">
                    <Link
                        to="/forgot-password"
                        className="text-blue-600 hover:underline text-sm"
                    >
                        Forgot Password?
                    </Link>
                </div>

                <p className="text-center mt-6">
                    Don't have an account?
                    <Link
                        to="/register"
                        className="text-red-600 font-semibold ml-2"
                    >
                        Register
                    </Link>
                </p>

            </div>

        </div>

    );
}

export default Login;

