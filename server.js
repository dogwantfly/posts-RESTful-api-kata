const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const postsRouteHandlers = require('./routes/posts.js');
const headers = require('./utils/corsHeaders.js');
const errorHandle = require('./utils/errorHandler.js');

dotenv.config({ path: './config.env' }); 
const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
  );

mongoose.connect(DB)
  .then(() => console.log('Connected to MongoDB...'));

const {
  getPosts,
  createPost,
  deletePosts,
  deletePostById,
  updatePostById
} = postsRouteHandlers;


const routes = {
  '/posts': {
    GET: getPosts,
    POST: createPost,
    DELETE: deletePosts,
  },
  '/posts/:id': {
    DELETE: deletePostById,
    PATCH: updatePostById,
  }
};

function matchRoute(req) {
  const urlSegments = req.url.split('?')[0].split('/');

  for (let pattern in routes) {

    const patternSegments = pattern.split('/');

    if (patternSegments.length !== urlSegments.length) {
      continue;
    }

    const params = {};
    const isMatch = patternSegments.every((seg, i) => {
      if (seg.startsWith(':')) {
        params[seg.slice(1)] = urlSegments[i]; // 提取參數
        return true;
      }
      return seg === urlSegments[i];
    });

    if (isMatch) {
      return { handler: routes[pattern][req.method], params };
    }
  }

  return null;  // 沒有匹配的路由
}


const requestListener = (req, res) => {

  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {

    let data = {}; 
    try {
        data = JSON.parse(body); 
    } catch (error) {
        if (body !== '') {
            errorHandle(res, error);
            return;
        }
    }

    const route = matchRoute(req);

    if (route && route.handler) {
      return route.handler(req, res, data, route.params);
    }

    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: 'false',
        message: '無此網站路由',
      })
    );
    res.end();
  });
  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  }
};

const server = http.createServer(requestListener);

server.listen(process.env.PORT || 3005);
