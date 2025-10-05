import { useState, useEffect } from "react";
import { bookmarkAPI } from "../utils/api";
import ArticleCard from "../components/ArticleCard";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookmarks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookmarkAPI.getAll();
      setBookmarks(response.data);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
      setError(err.response?.data?.message || "Failed to load bookmarks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleBookmarkChange = () => {
    fetchBookmarks();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Your Bookmarks
          </h1>
          <p className="text-gray-600">All your saved articles in one place</p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading bookmarks...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        {!loading && bookmarks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📑</div>
            <p className="text-gray-600 text-lg">No bookmarks yet</p>
            <p className="text-gray-500 text-sm mt-2">
              Start bookmarking articles to see them here!
            </p>
          </div>
        )}

        {!loading && bookmarks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((bookmark) => (
              <ArticleCard
                key={bookmark._id}
                article={bookmark}
                onBookmarkChange={handleBookmarkChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
