import { useState, useEffect } from "react";

/**
 * News Section component that fetches real-time emergency/disaster news
 * from NewsAPI with category filtering and search functionality.
 */
function NewsSection() {

    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [category, setCategory] = useState("disaster");
    const [searchQuery, setSearchQuery] = useState("");

    const API_KEY = "your-newsapi-key"; // Replace with your actual NewsAPI key
    const categories = ["disaster", "fire", "flood", "earthquake", "hurricane", "emergency"];

    useEffect(() => {
        fetchNews(category);
    }, [category]);

    /**
     * Fetch news from NewsAPI based on category.
     */
    const fetchNews = async (query: string) => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&language=en&pageSize=9&apiKey=${API_KEY}`
            );
            const data = await response.json();

            if (data.status === "ok") {
                setNews(data.articles);
            } else {
                setNews([]);
                setError("Unable to fetch live news. Showing demo data.");
            }
        } catch (err) {
            setError("Failed to fetch news. Showing demo data.");
            setNews([]);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle search form submission.
     */
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            fetchNews(searchQuery.trim());
        }
    };

    // Demo data as fallback
    const demoNews = [
        {
            title: "Heavy Rain Alert Issued for Coastal Areas",
            description: "IMD issues red alert for several coastal districts. Residents advised to stay indoors.",
            urlToImage: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0",
            url: "#",
            source: { name: "Emergency Alert" },
            publishedAt: new Date().toISOString(),
        },
        {
            title: "Fire Department Issues Summer Safety Guidelines",
            description: "With rising temperatures, fire departments issue preventive measures for citizens.",
            urlToImage: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
            url: "#",
            source: { name: "Safety First" },
            publishedAt: new Date().toISOString(),
        },
        {
            title: "Earthquake Preparedness: What You Need to Know",
            description: "Essential tips and guidelines for earthquake preparedness and safety measures.",
            urlToImage: "https://images.unsplash.com/photo-1504609773096-104ff2c73cb4",
            url: "#",
            source: { name: "Disaster Management" },
            publishedAt: new Date().toISOString(),
        },
    ];

    const displayNews = news.length > 0 ? news : demoNews;

    return (
        <section className="py-20 bg-gray-100">
            <div className="max-w-7xl mx-auto px-6">

                <h2 className="text-4xl font-bold text-center mb-4">
                    📰 Latest Emergency News
                </h2>

                <p className="text-center text-gray-600 mb-8">
                    Stay updated with the latest disaster alerts from around the world.
                </p>

                {/* Category Filter + Search */}
                <div className="flex flex-col md:flex-row gap-4 mb-10 justify-center">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => { setCategory(cat); setSearchQuery(""); }}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                                    category === cat
                                        ? "bg-red-600 text-white"
                                        : "bg-white text-gray-700 hover:bg-red-100"
                                }`}
                            >
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Search news..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <button
                            type="submit"
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg mb-8 text-center">
                        {error}
                    </div>
                )}

                {/* Loading Spinner */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                        <p className="mt-4 text-gray-500">Fetching latest news...</p>
                    </div>
                )}

                {/* News Grid */}
                {!loading && (
                    <div className="grid md:grid-cols-3 gap-8">
                        {displayNews.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
                            >
                                <img
                                    src={item.urlToImage || "https://images.unsplash.com/photo-1504711434969-e33886168d6c"}
                                    alt={item.title}
                                    className="w-full h-48 object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            "https://images.unsplash.com/photo-1504711434969-e33886168d6c";
                                    }}
                                />
                                <div className="p-6">
                                    <h3 className="text-lg font-bold mb-3 line-clamp-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {item.description || "No description available"}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">
                                            📰 {item.source?.name || "News Source"}
                                        </span>
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition"
                                        >
                                            Read More
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default NewsSection;
