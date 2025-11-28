const expressAsyncHandler = require("express-async-handler");
const Document = require("../Models/Document");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), 'uploads/documents');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow common document types
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'text/plain'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, images, and text files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
});

const DocumentController = {
  // Upload middleware
  uploadMiddleware: upload.single('file'),

  // Upload a document
  uploadDocument: expressAsyncHandler(async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: false,
          error: 'No file uploaded'
        });
      }

      const userId = req.user._id;
      const { caseId, category, description, tags } = req.body;

      const document = new Document({
        filename: req.file.filename,
        originalName: req.file.originalname,
        filePath: `/uploads/documents/${req.file.filename}`, // Store relative path for serving
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        uploadedBy: userId,
        case: caseId || null,
        category: category || 'other',
        description: description || '',
        tags: tags ? (typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags) : []
      });

      await document.save();

      res.status(201).json({
        status: true,
        message: 'Document uploaded successfully',
        document: document
      });
    } catch (error) {
      console.error('Upload document error:', error);
      // Delete uploaded file if document creation failed
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({
        status: false,
        error: 'Internal server error'
      });
    }
  }),

  // Get documents for a case or user
  getDocuments: expressAsyncHandler(async (req, res) => {
    try {
      const userId = req.user._id;
      const { caseId } = req.query;

      let query = {};

      if (caseId) {
        // If caseId is provided, check if user is client or lawyer of that case
        const LawyerDashboard = require("../Models/LawyerDashboard");
        const caseRecord = await LawyerDashboard.findById(caseId)
          .select('client lawyer');

        if (!caseRecord) {
          return res.status(404).json({
            status: false,
            error: 'Case not found'
          });
        }

        // Check if user is the client or lawyer of this case
        const isClient = caseRecord.client && caseRecord.client.toString() === userId.toString();
        const isLawyer = caseRecord.lawyer && caseRecord.lawyer.toString() === userId.toString();

        if (isClient || isLawyer) {
          // User is part of this case - show all documents for this case
          query = {
            case: caseId
          };
        } else {
          // User is not part of this case - only show documents explicitly shared with them
          query = {
            case: caseId,
            $or: [
              { sharedWith: userId },
              { isShared: true }
            ]
          };
        }
      } else {
        // No caseId - show user's own documents and documents shared with them
        query = {
          $or: [
            { uploadedBy: userId },
            { sharedWith: userId },
            { isShared: true }
          ]
        };
      }

      const documents = await Document.find(query)
        .populate('uploadedBy', 'FirstName LastName Email')
        .populate('case', 'clientName description')
        .sort({ createdAt: -1 });

      res.status(200).json({
        status: true,
        documents: documents
      });
    } catch (error) {
      console.error('Get documents error:', error);
      res.status(500).json({
        status: false,
        error: 'Internal server error'
      });
    }
  }),

  // Download a document
  downloadDocument: expressAsyncHandler(async (req, res) => {
    try {
      const { documentId } = req.params;
      const userId = req.user._id;

      const document = await Document.findById(documentId);
      if (!document) {
        return res.status(404).json({
          status: false,
          error: 'Document not found'
        });
      }

      // Check permissions
      const hasAccess = 
        document.uploadedBy.toString() === userId.toString() ||
        document.sharedWith.some(id => id.toString() === userId.toString()) ||
        (document.isShared && document.case);

      if (!hasAccess) {
        return res.status(403).json({
          status: false,
          error: 'You do not have permission to access this document'
        });
      }

      // Construct full file path
      const fullPath = path.join(process.cwd(), document.filePath);
      
      // Check if file exists
      if (!fs.existsSync(fullPath)) {
        return res.status(404).json({
          status: false,
          error: 'File not found on server'
        });
      }

      res.download(fullPath, document.originalName);
    } catch (error) {
      console.error('Download document error:', error);
      res.status(500).json({
        status: false,
        error: 'Internal server error'
      });
    }
  }),

  // Delete a document
  deleteDocument: expressAsyncHandler(async (req, res) => {
    try {
      const { documentId } = req.params;
      const userId = req.user._id;

      const document = await Document.findById(documentId);
      if (!document) {
        return res.status(404).json({
          status: false,
          error: 'Document not found'
        });
      }

      // Check permissions - only uploader can delete
      if (document.uploadedBy.toString() !== userId.toString()) {
        return res.status(403).json({
          status: false,
          error: 'You do not have permission to delete this document'
        });
      }

      // Delete file from filesystem
      const fullPath = path.join(process.cwd(), document.filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }

      await Document.findByIdAndDelete(documentId);

      res.status(200).json({
        status: true,
        message: 'Document deleted successfully'
      });
    } catch (error) {
      console.error('Delete document error:', error);
      res.status(500).json({
        status: false,
        error: 'Internal server error'
      });
    }
  }),

  // Update document metadata
  updateDocument: expressAsyncHandler(async (req, res) => {
    try {
      const { documentId } = req.params;
      const userId = req.user._id;
      const { category, description, tags, isShared, sharedWith } = req.body;

      const document = await Document.findById(documentId);
      if (!document) {
        return res.status(404).json({
          status: false,
          error: 'Document not found'
        });
      }

      // Check permissions
      if (document.uploadedBy.toString() !== userId.toString()) {
        return res.status(403).json({
          status: false,
          error: 'You do not have permission to update this document'
        });
      }

      if (category) document.category = category;
      if (description !== undefined) document.description = description;
      if (tags) document.tags = typeof tags === 'string' ? tags.split(',') : tags;
      if (isShared !== undefined) document.isShared = isShared;
      if (sharedWith) document.sharedWith = Array.isArray(sharedWith) ? sharedWith : [sharedWith];

      await document.save();

      res.status(200).json({
        status: true,
        message: 'Document updated successfully',
        document: document
      });
    } catch (error) {
      console.error('Update document error:', error);
      res.status(500).json({
        status: false,
        error: 'Internal server error'
      });
    }
  })
};

module.exports = DocumentController;

