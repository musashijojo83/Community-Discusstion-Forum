
const Post = require('../models/Post');

// US2.1 Create Post
const createPost = async (req, res) => {
  const { title, content, category, board } = req.body;

  try {
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const post = await Post.create({
      title,
      content,
      category,
      board,
      author: req.user.id
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// US2.2 Browse all posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'nickname avatar')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// US2.3 Edit own post
const updatePost = async (req, res) => {
  const { title, content, category } = req.body;

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// US2.3 Delete own post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const isOwner = post.author.toString() === req.user.id;
    const isModerator = req.user.role === 'moderator' || req.user.role === 'admin';

    if (!isOwner && !isModerator) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPost, getPosts, updatePost, deletePost };