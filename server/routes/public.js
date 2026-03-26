const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// GET all posts (public) with pagination, search, category filter
router.get('/posts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';

    let filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (category && category !== 'all') filter.category = category;

    const posts = await Post.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await Post.countDocuments(filter);

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET single post by slug (increment views)
router.get('/posts/:slug', async (req, res) => {
  try {
    let post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    post.views += 1;
    await post.save();

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET all categories (for filter)
router.get('/categories', (req, res) => {
  const categories = [
    'Latest ICAI Updates',
    'CA Results',
    'Admit Card / Exam Form',
    'Suggested Answers',
    'Study Material'
  ];
  res.json(categories);
});

module.exports = router;
