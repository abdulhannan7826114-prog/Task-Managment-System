const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: Object.values(err.errors)[0].message
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      error: 'This email is already registered'
    });
  }

  res.status(status).json({ error: message });
};

export default errorHandler;
