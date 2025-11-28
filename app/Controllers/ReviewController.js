const expressAsyncHandler = require("express-async-handler");
const Review = require("../Models/Review");
const LawyerDashboard = require("../Models/LawyerDashboard");
const UsersModel = require("../Models/UsersModel");

const ReviewController = {
  // Create a review
  createReview: expressAsyncHandler(async (req, res) => {
    try {
      const userId = req.user._id;
      const { lawyerId, caseId, rating, title, comment } = req.body;

      // Validate required fields
      if (!lawyerId || !rating || !comment) {
        return res.status(400).json({
          status: false,
          error: 'Lawyer ID, rating, and comment are required'
        });
      }

      // Validate rating range
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          status: false,
          error: 'Rating must be between 1 and 5'
        });
      }

      // Check if lawyer exists and is actually a lawyer
      const lawyer = await UsersModel.findById(lawyerId);
      if (!lawyer || !lawyer.isLawyer) {
        return res.status(404).json({
          status: false,
          error: 'Lawyer not found'
        });
      }

      // Check if case exists and belongs to the client (if caseId provided)
      if (caseId) {
        const caseRecord = await LawyerDashboard.findById(caseId);
        if (!caseRecord) {
          return res.status(404).json({
            status: false,
            error: 'Case not found'
          });
        }
        if (caseRecord.client.toString() !== userId.toString()) {
          return res.status(403).json({
            status: false,
            error: 'You can only review cases that belong to you'
          });
        }
        if (caseRecord.lawyer.toString() !== lawyerId.toString()) {
          return res.status(400).json({
            status: false,
            error: 'Case does not belong to this lawyer'
          });
        }

        // Check if review already exists for this case
        const existingReview = await Review.findOne({ case: caseId, client: userId });
        if (existingReview) {
          return res.status(409).json({
            status: false,
            error: 'You have already reviewed this case'
          });
        }
      }

      // Check if case is completed (only allow reviews for completed cases)
      if (caseId) {
        const caseRecord = await LawyerDashboard.findById(caseId);
        if (caseRecord.status !== 'completed') {
          return res.status(400).json({
            status: false,
            error: 'You can only review completed cases'
          });
        }
      }

      const review = new Review({
        lawyer: lawyerId,
        client: userId,
        case: caseId || null,
        rating: rating,
        title: title || '',
        comment: comment,
        isVerified: caseId ? true : false // Verified if linked to a case
      });

      await review.save();
      await review.populate('client', 'FirstName LastName Email');
      await review.populate('case', 'clientName description');

      res.status(201).json({
        status: true,
        message: 'Review submitted successfully',
        review: review
      });
    } catch (error) {
      console.error('Create review error:', error);
      if (error.code === 11000) {
        return res.status(409).json({
          status: false,
          error: 'You have already reviewed this case'
        });
      }
      res.status(500).json({
        status: false,
        error: 'Internal server error'
      });
    }
  }),

  // Get reviews for a lawyer
  getLawyerReviews: expressAsyncHandler(async (req, res) => {
    try {
      const { lawyerId } = req.params;
      const { limit = 10, skip = 0 } = req.query;

      const reviews = await Review.find({ 
        lawyer: lawyerId, 
        isVisible: true 
      })
        .populate('client', 'FirstName LastName Email')
        .populate('case', 'clientName description')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(skip));

      // Calculate average rating
      const ratingStats = await Review.aggregate([
        { $match: { lawyer: require('mongoose').Types.ObjectId(lawyerId), isVisible: true } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 },
            ratingDistribution: {
              $push: '$rating'
            }
          }
        }
      ]);

      const stats = ratingStats[0] || {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: []
      };

      // Calculate rating distribution
      const distribution = {
        5: stats.ratingDistribution.filter(r => r === 5).length,
        4: stats.ratingDistribution.filter(r => r === 4).length,
        3: stats.ratingDistribution.filter(r => r === 3).length,
        2: stats.ratingDistribution.filter(r => r === 2).length,
        1: stats.ratingDistribution.filter(r => r === 1).length
      };

      res.status(200).json({
        status: true,
        reviews: reviews,
        stats: {
          averageRating: Math.round(stats.averageRating * 10) / 10,
          totalReviews: stats.totalReviews,
          distribution: distribution
        }
      });
    } catch (error) {
      console.error('Get lawyer reviews error:', error);
      res.status(500).json({
        status: false,
        error: 'Internal server error'
      });
    }
  }),

  // Lawyer response to a review
  respondToReview: expressAsyncHandler(async (req, res) => {
    try {
      const { reviewId } = req.params;
      const userId = req.user._id;
      const { response } = req.body;

      const review = await Review.findById(reviewId);
      if (!review) {
        return res.status(404).json({
          status: false,
          error: 'Review not found'
        });
      }

      // Check if user is the lawyer being reviewed
      if (review.lawyer.toString() !== userId.toString()) {
        return res.status(403).json({
          status: false,
          error: 'You can only respond to reviews about you'
        });
      }

      review.lawyerResponse = {
        response: response,
        respondedAt: new Date()
      };
      await review.save();

      res.status(200).json({
        status: true,
        message: 'Response added successfully',
        review: review
      });
    } catch (error) {
      console.error('Respond to review error:', error);
      res.status(500).json({
        status: false,
        error: 'Internal server error'
      });
    }
  }),

  // Get user's reviews
  getUserReviews: expressAsyncHandler(async (req, res) => {
    try {
      const userId = req.user._id;

      const reviews = await Review.find({ client: userId })
        .populate('lawyer', 'FirstName LastName Email Expertise')
        .populate('case', 'clientName description')
        .sort({ createdAt: -1 });

      res.status(200).json({
        status: true,
        reviews: reviews
      });
    } catch (error) {
      console.error('Get user reviews error:', error);
      res.status(500).json({
        status: false,
        error: 'Internal server error'
      });
    }
  })
};

module.exports = ReviewController;

