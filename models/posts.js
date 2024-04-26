const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required.']
  },
  content: {
    type: String,
    required: [true, 'Content is required.']
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  }
}, { versionKey: false });
const Post = mongoose.model('Post', postSchema);

module.exports = Post;