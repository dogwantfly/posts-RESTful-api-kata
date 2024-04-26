const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required.'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required.'],
      trim: true,
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/150',
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { versionKey: false, timestamps: true }
);
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
