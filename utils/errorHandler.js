const headers = require('./corsHeaders.js');

function errorHandle(res, err) {
  console.log(err);
  res.writeHead(400, headers);
  res.write(
    JSON.stringify({
      status: 'false',
      message: err || '欄位填寫錯誤，或無此貼文 id',
    })
  );
  res.end();
}

module.exports = errorHandle;
