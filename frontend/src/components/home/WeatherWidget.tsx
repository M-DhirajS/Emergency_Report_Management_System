import { useState, useEffect } from "react";
import { Cloud, Droplets, Wind, Thermometer, MapPin } from "lucide-react";

/**
 * Weather Widget component that fetches and displays real-time weather data
 * from OpenWeatherMap API for the user's current location.
 */
function WeatherWidget() {

    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const API_KEY = "your-openweathermap-api-key"; // Replace with your actual API key

    useEffect(() => {
        fetchWeatherByCoords();
    }, []);

    /**
     * Get user's current location and fetch weather data.
     */
    const fetchWeatherByCoords = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const response = await fetch(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${API_KEY}&units=metric`
                    );
                    const data = await response.json();
                    setWeather(data);
                } catch (err) {
                    // Fallback: Try fetching by city name
                    fetchWeatherByCity("Nashik");
                } finally {
                    setLoading(false);
                }
            },
            () => {
                // Fallback if geolocation fails
                fetchWeatherByCity("Nashik");
            }
        );
    };

    /**
     * Fallback: Fetch weather by city name.
     */
    const fetchWeatherByCity = async (city: string) => {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
            );
            const data = await response.json();
            setWeather(data);
        } catch (err) {
            setError("Failed to fetch weather data");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="py-16 bg-blue-50">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-8"></div>
                        <div className="h-64 bg-gray-200 rounded-xl max-w-4xl mx-auto"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-16 bg-blue-50">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-gray-500">{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-blue-50">
            <div className="max-w-7xl mx-auto px-6">

                <h2 className="text-4xl font-bold text-center mb-10">
                    Today's Weather
                </h2>

                {weather && (
                    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
                        <div className="grid md:grid-cols-2 gap-10 items-center">

                            {/* Left: Temperature & Icon */}
                            <div className="text-center">
                                <img
                                    src={`https://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}@4x.png`}
                                    alt={weather.weather?.[0]?.description}
                                    className="w-32 h-32 mx-auto"
                                />
                                <h3 className="text-5xl font-bold">
                                    {Math.round(weather.main?.temp || 0)}°C
                                </h3>
                                <p className="text-xl mt-2 capitalize">
                                    {weather.weather?.[0]?.description || "N/A"}
                                </p>
                                <p className="text-gray-500 mt-2 flex items-center justify-center gap-1">
                                    <MapPin size={16} />
                                    {weather.name}, {weather.sys?.country}
                                </p>
                            </div>

                            {/* Right: Details */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-lg">
                                    <Thermometer className="text-red-500" size={28} />
                                    <div>
                                        <p className="text-sm text-gray-500">Feels Like</p>
                                        <p className="font-bold text-xl">{Math.round(weather.main?.feels_like || 0)}°C</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-lg">
                                    <Droplets className="text-blue-500" size={28} />
                                    <div>
                                        <p className="text-sm text-gray-500">Humidity</p>
                                        <p className="font-bold text-xl">{weather.main?.humidity || 0}%</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-lg">
                                    <Wind className="text-gray-500" size={28} />
                                    <div>
                                        <p className="text-sm text-gray-500">Wind Speed</p>
                                        <p className="font-bold text-xl">{weather.wind?.speed || 0} m/s</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-lg">
                                    <Cloud className="text-gray-400" size={28} />
                                    <div>
                                        <p className="text-sm text-gray-500">Cloudiness</p>
                                        <p className="font-bold text-xl">{weather.clouds?.all || 0}%</p>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <p className="text-center text-xs text-gray-400 mt-6">
                            Data provided by OpenWeatherMap
                        </p>
                    </div>
                )}

            </div>
        </section>
    );
}

export default WeatherWidget;

