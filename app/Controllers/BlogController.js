// controllers/blogController.js
const BlogPost = require("../Models/BlogsModel");

const BlogController = {
// Create
create: async (req, res) => {
  try {
    const { title, content, lawyerId } = req.body;
    const blogPost = new BlogPost({ title, content, lawyerId });
    await blogPost.save();
    const populatedBlogPost = await BlogPost.findById(blogPost._id).populate('lawyerId');

    res.json(populatedBlogPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
},


  // Read
  getAll: async (req, res) => {
    try {
      const blogPosts = await BlogPost.find().populate('lawyerId');
      res.json(blogPosts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  
  getById: async (req, res) => {
    try {
      const { blogId } = req.params;
      const blogPost = await BlogPost.findById(blogId).populate('lawyerId');
      if (!blogPost) {
        res.status(404).json({ error: "Blog post not found" });
        return;
      }
      res.json({ status: "success", blog: blogPost });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  
  update: async (req, res) => {
    try {
      const { blogId } = req.params;
      const { title, content } = req.body;
  
      const blogPost = await BlogPost.findByIdAndUpdate(
        blogId,
        { title, content },
        { new: true }
      ).populate('lawyerId');
  
      if (!blogPost) {
        console.log("Blog post not found for id:", blogId);
        return res.status(404).json({ error: "Blog post not found" });
      }
  
      return res.json(blogPost);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  },

  // Delete
  delete: async (req, res) => {
    try {
      const { blogId } = req.params;

      const blogPost = await BlogPost.findByIdAndDelete(blogId);

      if (!blogPost) {
        return res.status(404).json({ error: "Blog post not found" });
      }

      return res.json({ message: "Blog post deleted" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
};

module.exports = BlogController;
