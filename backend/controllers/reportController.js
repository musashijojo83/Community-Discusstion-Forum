
const Report = require('../models/Report');
const Post = require('../models/Post');

// US2.5 Report a post
const reportPost = async (req, res) => {
  const { postId, reason } = req.body;

  try {
    if (!postId || !reason) {
      return res.status(400).json({ message: 'Post ID and reason are required' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const report = await Report.create({
      post: postId,
      reportedBy: req.user.id,
      reason
    });

    res.status(201).json({
      report,
      message: 'Report submitted. Our moderators will review it.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// US5.1 Get pending reports (Moderator model)
const getReports = async (req, res) => {
  try {
    if (req.user.role !== 'moderator' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view reports' });
    }

    const reports = await Report.find({ status: 'pending' })
      .populate('post', 'title')
      .populate('reportedBy', 'nickname')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { reportPost, getReports };