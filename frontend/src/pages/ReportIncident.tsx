import { useState } from "react";
import api from "../services/api";
import LocationMap from "../components/maps/LocationMap";
import { useAuth } from "../context/AuthContext";

function ReportIncident() {
    
    const { user } = useAuth();

    const [incident, setIncident] = useState({
        title: "",
        category: "",
        description: "",
        location: ""
    });

    const [image, setImage] = useState<File | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {

        setIncident({
            ...incident,
            [e.target.name]: e.target.value,
        });

    };

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        if (
            !incident.title ||
            !incident.category ||
            !incident.description ||
            !incident.location
        ) {

            alert("Please fill all fields");

            return;

        }

        try {

            const formData = new FormData();

            formData.append("title", incident.title);
            formData.append("category", incident.category);
            formData.append("description", incident.description);
            formData.append("location", incident.location);
            formData.append("userEmail", user?.email || "");

            if (image) {

                formData.append("image", image);

            }

            await api.post("/incidents", formData, {

                headers: {

                    "Content-Type": "multipart/form-data",

                },

            });

            alert("Incident Report Submitted Successfully");

            setIncident({
                title: "",
                category: "",
                description: "",
                location: "",
            });

            setImage(null);

        } catch (error: any) {

            console.log(error);

            console.log(error.response);

            console.log(error.response?.data);

            alert(error.response?.data || "Failed to Submit Incident");

        }

    };

    return (

        <div className="min-h-screen bg-gray-100 p-10">

            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">

                <h1 className="text-4xl font-bold text-red-600 mb-6 text-center">

                    Report Emergency

                </h1>

                <div className="mb-8">

                    <LocationMap />

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <input
                        type="text"
                        className="w-full border p-3 rounded-lg"
                        placeholder="Incident Title"
                        name="title"
                        value={incident.title}
                        onChange={handleChange}
                    />

                    <select
                        className="w-full border p-3 rounded-lg"
                        name="category"
                        value={incident.category}
                        onChange={handleChange}
                    >

                        <option value="">Select Category</option>

                        <option value="Fire">Fire</option>

                        <option value="Flood">Flood</option>

                        <option value="Medical">Medical</option>

                        <option value="Accident">Accident</option>

                        <option value="Earthquake">Earthquake</option>

                    </select>

                    <textarea
                        rows={4}
                        className="w-full border p-3 rounded-lg"
                        placeholder="Description"
                        name="description"
                        value={incident.description}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        className="w-full border p-3 rounded-lg"
                        placeholder="Location"
                        name="location"
                        value={incident.location}
                        onChange={handleChange}
                    />

                    <div>

                        <label className="block font-semibold mb-2">

                            Upload Incident Image

                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            className="w-full border p-3 rounded-lg"
                            onChange={(e) => {

                                if (
                                    e.target.files &&
                                    e.target.files.length > 0
                                ) {

                                    setImage(e.target.files[0]);

                                }

                            }}
                        />

                    </div>

                    {image && (

                        <div>

                            <p className="text-green-600 font-semibold mb-2">

                                Selected Image:

                            </p>

                            <img
                                src={URL.createObjectURL(image)}
                                alt="Preview"
                                className="w-60 rounded-lg shadow-lg"
                            />

                        </div>

                    )}

                    <button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg w-full transition"
                    >

                        Submit Report

                    </button>

                </form>

            </div>

        </div>

    );

}

export default ReportIncident;