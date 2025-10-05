import { newsAPI } from "../utils/api";
import ArticleCard from "../components/ArticleCard";
import CategoryFilter from "../components/CategoryFilter";
import { useState } from "react";
import { useEffect } from "react";

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch news articles
  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};

      if (selectedCategory !== "general") {
        params.category = selectedCategory;
      }

      if (searchQuery) {
        params.query = searchQuery;
      }

      const response = await newsAPI.getNews(params);
      setArticles(response.data.articles || []);
    } catch (err) {
      console.error("Error fetching news:", err);
      setError(err.response?.data?.message || "Failed to load news");
    } finally {
      setLoading(false);
    }
  };

  // Fetch news when category or search changes
  useEffect(() => {
    fetchNews();
  }, [selectedCategory]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchNews();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Latest News & Updates
          </h1>
          <p className="text-gray-600">
            Stay informed with the latest news from around the world
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl justify-self-center mb-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for news..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
            />
            <button
              class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              Search
            </button>
          </form>
        </div>

        {/* Category Filter */}
        <div className="justify-self-center">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading news...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* No Results */}
        {!loading && articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No articles found.</p>
            <p className="text-gray-500 text-sm mt-2">
              Try a different category or search term.
            </p>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <ArticleCard key={index} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
