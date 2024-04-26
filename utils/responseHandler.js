const headers = require('./corsHeaders');

function successHandler(res, data, statusCode = 200) {
  res.writeHead(statusCode, headers);
  res.write(JSON.stringify({ status: true, data }));
  res.end();
}

function errorHandler(res, error, statusCode = 400) {
  const message =
    error instanceof Error
      ? error.message
      : error || '欄位填寫錯誤，或無此貼文 id';
  res.writeHead(statusCode, headers);
  res.write(
    JSON.stringify({
      status: false,
      message: message || '欄位填寫錯誤，或無此貼文 id',
    })
  );
  res.end();
}

module.exports = {
  successHandler,
  errorHandler,
};
