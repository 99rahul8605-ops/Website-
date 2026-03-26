const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['Latest ICAI Updates', 'CA Results', 'Admit Card / Exam Form', 'Suggested Answers', 'Study Material'],
    required: true
  },
  date: { type: Date, default: Date.now },
  pdfUrl: { type: String },
  linkUrl: { type: String },
  slug: { type: String, required: true, unique: true },
  views: { type: Number, default: 0 }
});

module.exports = mongoose.model('Post', PostSchema);
