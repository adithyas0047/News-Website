const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const { verifyToken, isAdmin } = require("../middlewares/auth");

// @route GET /api/articles
// @desc Get all published articles
// @access Public

router.get("/", async (req, res) => {
  try {
    const { category } = req.query; // fetch category from query

    let filter = { published: true }; // filter only published articles
    if (category) {
      filter.category = category;
    }

    const articles = (await Article.find(filter).populate("author", "name")) // get authors name
      .sort({ createdAt: -1 }); // sort by newest first

    res.json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route GET /api/articles/:id
// @desc Get single article by ID
// @access Public

router.get("/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate(
      "author",
      "name email"
    );

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json(article);
  } catch (error) {
    console.error(erro);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route POST /api/articles
// @desc Creates a new article
// @access Private (admin only)

router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const { title, content, published, imageUrl, category } = req.body;

    const article = new Article({
      title,
      content,
      category,
      author: req.user.id,
      published: published || "false",
    });

    await article.save();

    const populateArticle = await Article.findById(article.id).populate(
      "author",
      "name"
    );

    res.json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route PUT /api/articles/:id
// @desc Updates the article
// @access Private(admin only)

router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { title, content, category, published, imageUrl } = req.body;

    let article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    //update fields
    article.title = title || article.title;
    article.content = content || article.content;
    article.category = category || article.category;
    article.imageUrl = imageUrl || article.imageUrl;
    article.published = published !== undefined ? published : article.published;
    article.updatedAt = Date.now();

    await article.save();

    const populatedArticle = await Article.findById(article.id).populate(
      "author",
      "name"
    );

    res.json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route DELETE /api/articles/:id
// @desc Delete an article
// @access PRIVATE(admin only)

router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: "Article is deleted Successfully" });
  } catch (error) {
    console.erro(erro);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route GET /api/articles/admin/all
// @desc Get all articles including unpublished
// @access Private(admin only)

router.get("/admin/all", verifyToken, isAdmin, async (req, res) => {
  try {
    const article = await Article.find()
      .populate("author", "name")
      .sort({ createdAt: -1 });
    res.json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
