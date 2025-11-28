const expressAsyncHandler = require("express-async-handler");
const BlogPost = require("../Models/BlogsModel");
const BooksModel = require("../Models/BooksModel");

const AdminContentController = {
  // Get all blogs with filters
  getBlogs: expressAsyncHandler(async (req, res) => {
    try {
      const { page = 1, limit = 10, search, lawyerId } = req.query;

      const query = {};

      if (lawyerId) {
        query.lawyerId = lawyerId;
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      let blogs = await BlogPost.find(query)
        .populate('lawyerId', 'FirstName LastName Email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        blogs = blogs.filter(blog =>
          blog.title?.toLowerCase().includes(searchLower) ||
          blog.content?.toLowerCase().includes(searchLower) ||
          blog.lawyerId?.FirstName?.toLowerCase().includes(searchLower) ||
          blog.lawyerId?.LastName?.toLowerCase().includes(searchLower)
        );
      }

      const total = await BlogPost.countDocuments(query);

      res.status(200).json({
        status: true,
        blogs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Get blogs error:', error);
      res.status(500).json({
        status: false,
        error: 'Failed to fetch blogs'
      });
    }
  }),

  // Delete blog
  deleteBlog: expressAsyncHandler(async (req, res) => {
    try {
      const { blogId } = req.params;

      const blog = await BlogPost.findByIdAndDelete(blogId);

      if (!blog) {
        return res.status(404).json({
          status: false,
          error: 'Blog not found'
        });
      }

      res.status(200).json({
        status: true,
        message: 'Blog deleted successfully'
      });
    } catch (error) {
      console.error('Delete blog error:', error);
      res.status(500).json({
        status: false,
        error: 'Failed to delete blog'
      });
    }
  }),

  // Get all books
  getBooks: expressAsyncHandler(async (req, res) => {
    try {
      const { page = 1, limit = 10, search } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      let books = await BooksModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        books = books.filter(book =>
          book.title?.toLowerCase().includes(searchLower) ||
          book.author?.toLowerCase().includes(searchLower) ||
          book.description?.toLowerCase().includes(searchLower)
        );
      }

      const total = await BooksModel.countDocuments();

      res.status(200).json({
        status: true,
        books,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Get books error:', error);
      res.status(500).json({
        status: false,
        error: 'Failed to fetch books'
      });
    }
  }),

  // Create book
  createBook: expressAsyncHandler(async (req, res) => {
    try {
      const { title, author, description, imageUrl, pdfUrl } = req.body;

      if (!title || !author) {
        return res.status(400).json({
          status: false,
          error: 'Title and author are required'
        });
      }

      const book = new BooksModel({
        title,
        author,
        description,
        imageUrl,
        pdfUrl
      });

      await book.save();

      res.status(201).json({
        status: true,
        message: 'Book created successfully',
        book
      });
    } catch (error) {
      console.error('Create book error:', error);
      res.status(500).json({
        status: false,
        error: 'Failed to create book'
      });
    }
  }),

  // Update book
  updateBook: expressAsyncHandler(async (req, res) => {
    try {
      const { bookId } = req.params;
      const { title, author, description, imageUrl, pdfUrl } = req.body;

      const book = await BooksModel.findByIdAndUpdate(
        bookId,
        { title, author, description, imageUrl, pdfUrl },
        { new: true }
      );

      if (!book) {
        return res.status(404).json({
          status: false,
          error: 'Book not found'
        });
      }

      res.status(200).json({
        status: true,
        message: 'Book updated successfully',
        book
      });
    } catch (error) {
      console.error('Update book error:', error);
      res.status(500).json({
        status: false,
        error: 'Failed to update book'
      });
    }
  }),

  // Delete book
  deleteBook: expressAsyncHandler(async (req, res) => {
    try {
      const { bookId } = req.params;

      const book = await BooksModel.findByIdAndDelete(bookId);

      if (!book) {
        return res.status(404).json({
          status: false,
          error: 'Book not found'
        });
      }

      res.status(200).json({
        status: true,
        message: 'Book deleted successfully'
      });
    } catch (error) {
      console.error('Delete book error:', error);
      res.status(500).json({
        status: false,
        error: 'Failed to delete book'
      });
    }
  })
};

module.exports = AdminContentController;

