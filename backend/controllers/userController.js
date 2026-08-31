const User = require('../models/User');

// Update user's Avatar charactor
const updateAvatar = async (req, res) => {
  const { avatar } = req.body;

  try {
    if (!avatar) {
      return res.status(400).json({ message: 'Avatar URL is required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.avatar = avatar;
    await user.save();

    res.json({
      _id: user._id,
      email: user.email,
      nickname: user.nickname,
      role: user.role,
      avatar: user.avatar
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateAvatar };
