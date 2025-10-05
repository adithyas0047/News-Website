import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { bookmarkAPI } from "../utils/api";

const ArticleCard = ({ article, onBookmarkChange }) => {
  const { isAuthenticated } = useAuth();
  const [isBookmark, setIsBookmark] = useState(false);
  const [bookmarkId, setBookmarkId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check if article is already bookmarked when component mounts
  useEffect(() => {
    const checkIfBookmarked = async () => {
      if (isAuthenticated && article.url) {
        try {
          const response = await bookmarkAPI.check(article.url);
          setIsBookmark(response.data.isBookmarked);
          setBookmarkId(response.data.bookmarkId);
        } catch (error) {
          console.error("Error checking bookmark:", error);
        }
      }
    };

    checkIfBookmarked();
  }, [isAuthenticated, article.url]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Handle bookmark toggle
  const handleBookmark = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert("Please login to bookmark articles");
      return;
    }

    setLoading(true);

    try {
      if (isBookmark) {
        // Remove bookmark
        await bookmarkAPI.delete(bookmarkId);
        setIsBookmark(false);
        setBookmarkId(null);
        if (onBookmarkChange) onBookmarkChange();
      } else {
        // Save bookmark
        const response = await bookmarkAPI.save({
          title: article.title,
          description: article.description,
          url: article.url,
          imageUrl: article.imageUrl || article.urlToImage,
          source: article.source?.name || article.source,
          publishedAt: article.publishedAt,
        });
        setIsBookmark(true);
        setBookmarkId(response.data.bookmark._id);
      }
    } catch (error) {
      console.error("Bookmark error:", error);
      alert(error.response?.data?.message || "Failed to update bookmark");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Article Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={
            article.imageUrl ||
            article.urlToImage ||
            "https://via.placeholder.com/400x200?text=News+Article"
          }
          alt={article.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/400x200?text=News+Article";
          }}
        />
        {/* Bookmark Button */}
        {isAuthenticated && (
          <button
            onClick={handleBookmark}
            disabled={loading}
            className={`absolute top-2 right-2 p-2 rounded-full transition ${
              isBookmark
                ? "bg-yellow-400 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isBookmark ? "⭐" : "☆"}
          </button>
        )}
      </div>

      {/* Article Content */}
      <div className="p-4">
        {/* Source and Date */}
        <div className="flex justify-between items-center mb-2 text-sm text-gray-500">
          <span className="font-semibold text-blue-600">
            {article.source?.name || article.source || "Unknown Source"}
          </span>
          {article.publishedAt && (
            <span>{formatDate(article.publishedAt)}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition">
          {article.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {article.description || "No description available."}
        </p>

        {/* Read More Button */}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm font-semibold"
        >
          Read Full Article →
        </a>
      </div>
    </div>
  );
};

export default ArticleCard;
