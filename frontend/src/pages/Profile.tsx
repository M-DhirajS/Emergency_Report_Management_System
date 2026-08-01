import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Camera, Save, Lock, ArrowLeft } from "lucide-react";

/**
 * User Profile page with update profile, change password, and profile picture upload.
 */
function Profile() {

    const { user, updateUser } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Profile state
    const [fullName, setFullName] = useState(user?.fullName || "");
    const [mobile, setMobile] = useState(user?.mobile || "");
    const [updating, setUpdating] = useState(false);
    const [profileMessage, setProfileMessage] = useState("");

    // Password state
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordUpdating, setPasswordUpdating] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState("");

    /**
     * Update profile details.
     */
    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);
        setProfileMessage("");

        try {
            const response = await api.put("/profile/update", {
                email: user?.email,
                fullName,
                mobile
            });

            updateUser({ fullName, mobile });
            setProfileMessage("✅ Profile updated successfully");
        } catch (error: any) {
            setProfileMessage("❌ " + (error.response?.data?.error || "Update failed"));
        } finally {
            setUpdating(false);
        }
    };

    /**
     * Upload profile picture.
     */
    const handleUploadPicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("email", user?.email || "");
        formData.append("file", file);

        try {
            const response = await api.post("/profile/upload-picture", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            updateUser({ profilePicture: response.data.profilePicture });
            setProfileMessage("✅ Profile picture updated");
        } catch (error) {
            setProfileMessage("❌ Failed to upload picture");
        }
    };

    /**
     * Change password.
     */
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage("");

        if (newPassword !== confirmPassword) {
            setPasswordMessage("❌ Passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            setPasswordMessage("❌ Password must be at least 6 characters");
            return;
        }

        setPasswordUpdating(true);

        try {
            await api.put("/profile/change-password", {
                email: user?.email,
                oldPassword,
                newPassword
            });

            setPasswordMessage("✅ Password changed successfully");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setShowPasswordForm(false);
        } catch (error: any) {
            setPasswordMessage("❌ " + (error.response?.data?.error || "Failed to change password"));
        } finally {
            setPasswordUpdating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-10">
            <div className="max-w-3xl mx-auto">

                <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-8">
                    My Profile
                </h1>

                {/* Profile Card */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                    {/* Cover Photo */}
                    <div className="bg-gradient-to-r from-red-500 to-red-700 h-32 md:h-40"></div>

                    {/* Profile Section */}
                    <div className="px-6 pb-6">
                        <div className="flex flex-col md:flex-row md:items-end -mt-16 md:-mt-20 mb-6">
                            {/* Profile Picture */}
                            <div className="relative">
                                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg">
                                    {user?.profilePicture ? (
                                        <img
                                            src={`http://localhost:8080/uploads/${user.profilePicture}`}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                                            {user?.fullName?.charAt(0)?.toUpperCase() || "👤"}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                                >
                                    <Camera size={18} className="text-red-600" />
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleUploadPicture}
                                />
                            </div>
                            <div className="mt-4 md:mt-0 md:ml-6">
                                <h2 className="text-2xl font-bold">{user?.fullName}</h2>
                                <p className="text-gray-500">{user?.email}</p>
                                <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold mt-2">
                                    {user?.role}
                                </span>
                            </div>
                        </div>

                        {profileMessage && (
                            <div className="mb-4 px-4 py-2 rounded bg-gray-50 text-sm">
                                {profileMessage}
                            </div>
                        )}

                        {/* Update Profile Form */}
                        <form onSubmit={handleUpdateProfile} className="space-y-5">
                            <div className="grid md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        placeholder="Your full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={user?.email || ""}
                                        className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-500"
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Mobile</label>
                                    <input
                                        type="text"
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        placeholder="Mobile number"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={updating}
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 disabled:bg-gray-400"
                            >
                                <Save size={18} />
                                {updating ? "Saving..." : "Update Profile"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Change Password Card */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <button
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                        className="flex items-center justify-between w-full"
                    >
                        <div className="flex items-center gap-3">
                            <Lock size={22} className="text-red-600" />
                            <h2 className="text-xl font-bold">Change Password</h2>
                        </div>
                        <ArrowLeft className={`transform transition ${showPasswordForm ? "rotate-90" : ""}`} />
                    </button>

                    {showPasswordForm && (
                        <form onSubmit={handleChangePassword} className="mt-6 space-y-5">
                            {passwordMessage && (
                                <div className="px-4 py-2 rounded bg-gray-50 text-sm">
                                    {passwordMessage}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-semibold mb-1">Current Password</label>
                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="Enter current password"
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold mb-1">New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        placeholder="Min 6 characters"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Confirm Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={passwordUpdating}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg disabled:bg-gray-400"
                            >
                                {passwordUpdating ? "Changing..." : "Change Password"}
                            </button>
                        </form>
                    )}
                </div>

            </div>
        </div>
    );
}

export default Profile;

