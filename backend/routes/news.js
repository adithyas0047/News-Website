const express = require("express");
const router = express.Router();
const axios = require("axios");

// @route   GET /api/news
// @desc    Fetch news from NewsAPI
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { category, query, page = 1 } = req.query;

    // Debug: Check if API key exists
    if (!process.env.NEWS_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "NEWS_API_KEY not found in environment variables",
      });
    }

    console.log("API Key exists:", process.env.NEWS_API_KEY ? "Yes" : "No");
    console.log("API Key length:", process.env.NEWS_API_KEY?.length);

    // Build the API URL based on parameters
    let apiUrl = "https://newsapi.org/v2/top-headlines";

    const params = {
      apiKey: process.env.NEWS_API_KEY,
      country: "us", // You can change this to 'in' for India, 'gb' for UK, etc.
      pageSize: 20,
      page: page,
    };

    // If category is provided, add it to params
    if (category && category !== "all") {
      params.category = category.toLowerCase();
    }

    // If search query is provided, use different endpoint
    if (query) {
      apiUrl = "https://newsapi.org/v2/everything";
      params.q = query;
      delete params.country; // 'everything' endpoint doesn't use country
      delete params.category; // 'everything' endpoint doesn't use category
    }

    const response = await axios.get(apiUrl, { params });

    // Transform the data to match our format
    const articles = response.data.articles.map((article) => ({
      title: article.title,
      description: article.description,
      content: article.content,
      author: article.author || "Unknown",
      source: article.source.name,
      url: article.url,
      imageUrl:
        article.urlToImage ||
        "https://via.placeholder.com/800x400?text=News+Article",
      publishedAt: article.publishedAt,
    }));

    res.json({
      success: true,
      totalResults: response.data.totalResults,
      articles: articles,
    });
  } catch (error) {
    console.error("News API Error:", error.response?.data || error.message);

    // More detailed error logging
    if (error.response) {
      console.error("API Response Status:", error.response.status);
      console.error("API Response Data:", error.response.data);
    }

    res.status(500).json({
      success: false,
      message: "Error fetching news",
      error: error.response?.data?.message || error.message,
      statusCode: error.response?.status,
    });
  }
});

// @route   GET /api/news/categories
// @desc    Get available news categories
// @access  Public
router.get("/categories", (req, res) => {
  const categories = [
    "business",
    "entertainment",
    "general",
    "health",
    "science",
    "sports",
    "technology",
  ];
  res.json(categories);
});

// @route   GET /api/news/sources
// @desc    Get news sources
// @access  Public
router.get("/sources", async (req, res) => {
  try {
    const response = await axios.get(
      "https://newsapi.org/v2/top-headlines/sources",
      {
        params: {
          apiKey: process.env.NEWS_API_KEY,
          country: "in",
        },
      }
    );

    res.json({
      success: true,
      sources: response.data.sources,
    });
  } catch (error) {
    console.error("News API Error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching sources",
    });
  }
});

module.exports = router;
