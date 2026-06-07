exports.notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

exports.errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((val) => val.message).join(', ');
  } else if (err.code === 'LIMIT_UNEXPECTED_FILE' || err.message === 'Unexpected field') {
    statusCode = 400;
    message = 'Too many images or invalid field name sent.';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format.';
  }

  res.status(statusCode).json({
    message: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
