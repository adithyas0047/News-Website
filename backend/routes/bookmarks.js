const express = require("express");
const router = express.Router();
const Bookmarks = require("../models/Bookmarks");
const { verifyToken } = require("../middlewares/auth");

// @route GET /api/bookmarks
// @desc Get all bookmarks for the logged-in user
// @access Private(must be logged in)

router.get("/", verifyToken, async (req, res) => {
  try {
    // find all the bookmarks where user matches the logged-in user's ID
    // req.user.id comes from JWT token (set by verifyToken middleware)
    const bookmarks = await Bookmarks.find({ user: req.user.id }).sort({
      savedAt: -1,
    });

    res.json(bookmarks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route POST /api/bookmarks
// @desc Save/Bookmark a news article
// @access Private

router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, description, url, imageUrl, source, publishedAt } = req.body;

    //check if article is already bookmarked by this user
    let existingBookmark = await Bookmarks.findOne({
      user: req.user.id,
      url: url,
    });

    if (existingBookmark) {
      return res.status(400).json({
        message: "Article bookmark already exists",
        bookmarkId: existingBookmark._id,
      });
    }

    //create new bookmark
    const bookmark = new Bookmarks({
      user: req.user.id,
      title,
      description,
      url,
      imageUrl,
      source,
      publishedAt,
    });

    await bookmark.save();
    res.json({
      message: "Article Saved",
      bookmark,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route DELETE /api/bookmarks/:id
// @desc Delete the selected bookmark
// @access Private

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const bookmark = await Bookmarks.findById(req.params.id);

    // if bookmark does not exists
    if (!bookmark) {
      return res
        .status(404)
        .json({ message: "The bookmark you wish you delete is not found" });
    }

    // if the user's bookmark does not exists or if the user is trying to delete another user's bookmark
    if (bookmark.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not Authorized to delete this bookmark" });
    }

    await Bookmarks.findByIdAndDelete(req.params.id);
    res.json({ message: "Bookmark deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route POST /api/bookmarks/check
// @desc Check if specified article URL is bookmarked
// @access Private

router.post("/check", verifyToken, async (req, res) => {
  try {
    const { url } = req.body;

    // look for bookmark with this user + URL combination
    const bookmark = await Bookmarks.findOne({ user: req.user.id, url: url });

    // return whether it's bookmarked and the bookmark ID (for deletion)
    res.json({
      isBookmarked: !!bookmark,
      bookmarkId: bookmark?._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
