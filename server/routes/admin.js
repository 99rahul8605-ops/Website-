const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const slugify = require('../utils/slugify');

// @route   POST /api/admin/login
router.post('/login',
  [
    body('username').notEmpty(),
    body('password').notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

      const isMatch = await user.comparePassword(password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

      const payload = { user: { id: user.id } };
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   POST /api/admin/upload
router.post('/upload', auth, upload.single('pdf'), (req, res) => {
  if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ fileUrl });
});

// @route   GET /api/admin/posts (all posts for admin table)
router.get('/posts', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }).select('-__v');
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/admin/posts
router.post('/posts',
  auth,
  [
    body('title').notEmpty(),
    body('description').notEmpty(),
    body('category').notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, description, category, pdfUrl, linkUrl } = req.body;
    try {
      let slug = slugify(title);
      let existing = await Post.findOne({ slug });
      if (existing) slug = `${slug}-${Date.now()}`;

      const newPost = new Post({
        title,
        description,
        category,
        pdfUrl,
        linkUrl,
        slug
      });
      await newPost.save();
      res.json(newPost);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT /api/admin/posts/:id
router.put('/posts/:id',
  auth,
  [
    body('title').notEmpty(),
    body('description').notEmpty(),
    body('category').notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, description, category, pdfUrl, linkUrl } = req.body;
    try {
      let post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ msg: 'Post not found' });

      post.title = title;
      post.description = description;
      post.category = category;
      post.pdfUrl = pdfUrl || '';
      post.linkUrl = linkUrl || '';

      if (title !== post.title) {
        let newSlug = slugify(title);
        let existing = await Post.findOne({ slug: newSlug, _id: { $ne: post._id } });
        if (existing) newSlug = `${newSlug}-${Date.now()}`;
        post.slug = newSlug;
      }

      await post.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE /api/admin/posts/:id
router.delete('/posts/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    await post.deleteOne();
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
