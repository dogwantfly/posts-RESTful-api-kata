const mongoose = require('mongoose');

const Post = require('../models/posts');
const headers = require('../utils/corsHeaders.js');
const { successHandler, errorHandler } = require('../utils/responseHandler');

module.exports = {
  getPosts: async function (req, res) {
    const posts = await Post.find();
    res.writeHead(200, headers);
    res.write(JSON.stringify(posts));
    res.end();
  },

  createPost: async function (req, res, data) {
    try {
      const { title, content } = data;
      if (content !== undefined && title !== undefined) {
        const newPost = {
          title,
          content,
        };
        const result = await Post.create(newPost);

        successHandler(res, result, 201);
      } else {
        errorHandler(res);
      }
    } catch (error) {
      errorHandler(res, error);
    }
  },

  deletePosts: async function (req, res) {
    const result = await Post.deleteMany();
    successHandler(res, result);
  },

  deletePostById: async function (req, res, data, params) {
    try {
      const { id } = params;
      if (!mongoose.isValidObjectId(id)) {
        return errorHandler(res, '貼文 id 不符合格式或不存在');
      }
      const result = await Post.findByIdAndDelete(id);

      if (result !== null) {
        successHandler(res, result);
      } else {
        return errorHandler(res);
      }
    } catch (error) {
      errorHandler(res, error);
    }
  },

  updatePostById: async function (req, res, data, params) {
    try {
      const { id } = params;
      const { content } = data;

      if (!mongoose.isValidObjectId(id)) {
        return errorHandler(res, '貼文 id 不符合格式或不存在');
      }
      if (!content) {
        return errorHandler(res, '貼文內容不得為空');
      }
      const existingPost = await Post.findById(id);
      if (!existingPost) {
        return errorHandler(res, '貼文 id 不存在');
      }
      const editContent = { content };
      const result = await Post.findByIdAndUpdate(id, editContent, {
        new: true,
      });
      if (!result) {
        return errorHandler(res, '更新錯誤');
      }
      successHandler(res, result);
    } catch (error) {
      errorHandler(res, error);
    }
  },
};
