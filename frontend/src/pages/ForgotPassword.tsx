import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Button from "../components/common/Button";
import Input from "../components/common/Input";

/**
 * Forgot Password page with OTP-based password reset flow.
 * Step 1: Send OTP to email
 * Step 2: Verify OTP
 * Step 3: Reset password
 */
function ForgotPassword() {

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    /**
     * Step 1: Send OTP to the provided email.
     */
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        if (!email) {
            setError("Please enter your email");
            setLoading(false);
            return;
        }

        try {
            const response = await api.post("/forgot-password", { email });
            setMessage(response.data.message || "OTP sent to your email");
            setStep(2);
        } catch (error: any) {
            setError(error.response?.data?.error || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    /**
     * Step 2: Verify OTP.
     */
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        if (!otp) {
            setError("Please enter OTP");
            setLoading(false);
            return;
        }

        try {
            const response = await api.post("/verify-otp", { email, otp });
            setMessage("OTP verified successfully");
            setStep(3);
        } catch (error: any) {
            setError(error.response?.data?.error || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    /**
     * Step 3: Reset password.
     */
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        if (!newPassword || !confirmPassword) {
            setError("Please fill all fields");
            setLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        try {
            const response = await api.post("/reset-password", {
                email,
                otp,
                newPassword
            });
            setMessage("Password reset successfully! Redirecting to login...");
            setTimeout(() => window.location.href = "/login", 2000);
        } catch (error: any) {
            setError(error.response?.data?.error || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-5">
            <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8">

                <h1 className="text-3xl font-bold text-center text-red-600 mb-2">
                    🔐 Forgot Password
                </h1>

                <p className="text-center text-gray-500 mb-8">
                    {step === 1 && "Enter your email to receive OTP"}
                    {step === 2 && "Enter the OTP sent to your email"}
                    {step === 3 && "Create a new password"}
                </p>

                {/* Progress Steps */}
                <div className="flex justify-center mb-8 space-x-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                    <div className="w-12 h-1 mt-3.5 bg-gray-200"><div className={`h-full ${step >= 2 ? 'bg-red-600' : 'bg-gray-200'} transition`}></div></div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                    <div className="w-12 h-1 mt-3.5 bg-gray-200"><div className={`h-full ${step >= 3 ? 'bg-red-600' : 'bg-gray-200'} transition`}></div></div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
                </div>

                {message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Step 1: Send OTP */}
                {step === 1 && (
                    <form onSubmit={handleSendOtp} className="space-y-5">
                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            placeholder="Enter your registered email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button
                            text={loading ? "Sending OTP..." : "Send OTP"}
                            type="submit"
                            disabled={loading}
                        />
                    </form>
                )}

                {/* Step 2: Verify OTP */}
                {step === 2 && (
                    <form onSubmit={handleVerifyOtp} className="space-y-5">
                        <Input
                            label="OTP"
                            type="text"
                            name="otp"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <Button
                            text={loading ? "Verifying..." : "Verify OTP"}
                            type="submit"
                            disabled={loading}
                        />
                        <p className="text-center text-sm text-gray-500 mt-4">
                            Didn't receive OTP? {" "}
                            <button
                                onClick={handleSendOtp}
                                className="text-red-600 font-semibold hover:underline"
                            >
                                Resend
                            </button>
                        </p>
                    </form>
                )}

                {/* Step 3: Reset Password */}
                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-5">
                        <Input
                            label="New Password"
                            type="password"
                            name="newPassword"
                            placeholder="Enter new password (min 6 chars)"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <Input
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Button
                            text={loading ? "Resetting..." : "Reset Password"}
                            type="submit"
                            disabled={loading}
                        />
                    </form>
                )}

                <p className="text-center mt-6">
                    Remember your password?
                    <Link to="/login" className="text-red-600 font-semibold ml-2">
                        Login
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default ForgotPassword;

