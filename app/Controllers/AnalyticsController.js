const expressAsyncHandler = require("express-async-handler");
const LawyerDashboard = require("../Models/LawyerDashboard");

const AnalyticsController = {
  getAnalytics: expressAsyncHandler(async (req, res) => {
    try {
      const { lawyerId } = req.params;
      const userId = req.user._id; // From auth middleware

      // Verify user is the lawyer
      if (lawyerId !== userId.toString()) {
        return res.status(403).json({
          status: false,
          error: 'You do not have permission to view these analytics'
        });
      }

      // Get all cases for this lawyer
      const cases = await LawyerDashboard.find({ lawyer: lawyerId })
        .populate('client', 'FirstName LastName Email')
        .sort({ createdAt: -1 });

      // Calculate revenue analytics
      const now = new Date();
      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const currentYear = new Date(now.getFullYear(), 0, 1);

      const monthlyRevenue = cases
        .filter(c => {
          const caseDate = new Date(c.createdAt);
          return caseDate >= currentMonth && c.status === 'completed';
        })
        .reduce((sum, c) => sum + (c.income || 0), 0);

      const lastMonthRevenue = cases
        .filter(c => {
          const caseDate = new Date(c.createdAt);
          return caseDate >= lastMonth && caseDate < currentMonth && c.status === 'completed';
        })
        .reduce((sum, c) => sum + (c.income || 0), 0);

      const yearlyRevenue = cases
        .filter(c => {
          const caseDate = new Date(c.createdAt);
          return caseDate >= currentYear && c.status === 'completed';
        })
        .reduce((sum, c) => sum + (c.income || 0), 0);

      // Revenue by month (last 12 months)
      const revenueByMonth = [];
      for (let i = 11; i >= 0; i--) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
        const monthRevenue = cases
          .filter(c => {
            const caseDate = new Date(c.createdAt);
            return caseDate >= monthStart && caseDate <= monthEnd && c.status === 'completed';
          })
          .reduce((sum, c) => sum + (c.income || 0), 0);
        revenueByMonth.push({
          month: monthStart.toLocaleString('default', { month: 'short', year: 'numeric' }),
          revenue: monthRevenue
        });
      }

      // Client statistics
      const uniqueClients = new Set(cases.map(c => c.client?.toString()).filter(Boolean));
      const newClientsThisMonth = cases
        .filter(c => {
          const caseDate = new Date(c.createdAt);
          return caseDate >= currentMonth;
        })
        .map(c => c.client?.toString())
        .filter(Boolean);
      const newClientsCount = new Set(newClientsThisMonth).size;

      // Case statistics
      const casesByStatus = {
        pending: cases.filter(c => c.status === 'pending').length,
        accepted: cases.filter(c => c.status === 'accepted').length,
        in_progress: cases.filter(c => c.status === 'in_progress').length,
        completed: cases.filter(c => c.status === 'completed').length,
        cancelled: cases.filter(c => c.status === 'cancelled').length
      };

      // Calculate average resolution time (for completed cases)
      const completedCases = cases.filter(c => c.status === 'completed' && c.createdAt && c.updatedAt);
      const avgResolutionTime = completedCases.length > 0
        ? completedCases.reduce((sum, c) => {
            const resolutionTime = new Date(c.updatedAt) - new Date(c.createdAt);
            return sum + resolutionTime;
          }, 0) / completedCases.length / (1000 * 60 * 60 * 24) // Convert to days
        : 0;

      // Performance metrics
      const totalCases = cases.length;
      const completionRate = totalCases > 0 
        ? (casesByStatus.completed / totalCases) * 100 
        : 0;

      res.status(200).json({
        status: true,
        analytics: {
          revenue: {
            monthly: monthlyRevenue,
            lastMonth: lastMonthRevenue,
            yearly: yearlyRevenue,
            byMonth: revenueByMonth,
            trend: monthlyRevenue > lastMonthRevenue ? 'up' : monthlyRevenue < lastMonthRevenue ? 'down' : 'stable'
          },
          clients: {
            total: uniqueClients.size,
            newThisMonth: newClientsCount,
            returning: uniqueClients.size - newClientsCount
          },
          cases: {
            total: totalCases,
            byStatus: casesByStatus,
            averageResolutionTime: Math.round(avgResolutionTime * 10) / 10, // Round to 1 decimal
            completionRate: Math.round(completionRate * 10) / 10
          },
          performance: {
            completionRate: Math.round(completionRate * 10) / 10,
            averageResolutionTime: Math.round(avgResolutionTime * 10) / 10
          }
        }
      });
    } catch (error) {
      console.error('Get analytics error:', error);
      res.status(500).json({
        status: false,
        error: 'Internal server error'
      });
    }
  })
};

module.exports = AnalyticsController;

