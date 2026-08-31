
const Board = require('../models/Board');
const User = require('../models/User');

// US2.4 Create Board
const createBoard = async (req, res) => {
  const { name, description, rules, maxMembers, needsApproval } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ message: 'Board name is required' });
    }

    const board = await Board.create({
      name,
      description,
      rules,
      maxMembers,
      needsApproval,
      moderator: req.user.id,
      members: [req.user.id]
    });

    const user = await User.findById(req.user.id);
    if (user.role === 'member') {
      user.role = 'moderator';
    }
    user.moderatedBoards.push(board._id);
    await user.save();

    res.status(201).json({
      board,
      message: 'Board created. You are now the Moderator of this board!',
      newRole: user.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBoards = async (req, res) => {
  try {
    const boards = await Board.find().populate('moderator', 'nickname');
    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBoard, getBoards };