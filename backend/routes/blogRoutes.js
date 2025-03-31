const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const verifyToken = require("../middleware/authMiddleware"); // Import JWT middleware

// ✅ Get All Blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "name email"); // Populate author details
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Create a Blog (Requires Authentication)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const newBlog = new Blog({ title, content, author: req.user.userId });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Update Blog (Only Author Can Edit)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    if (blog.author.toString() !== req.user.userId)
      return res.status(403).json({ error: "Unauthorized" });

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;

    await blog.save();
    res.json({ message: "Blog updated successfully", blog });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Delete Blog (Only Author Can Delete)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    if (blog.author.toString() !== req.user.userId)
      return res.status(403).json({ error: "Unauthorized" });

    await blog.deleteOne();
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
