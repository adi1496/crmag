const AppError = require('./../utils/AppError');

/**************** FUNCTIONS FOR HANDLING THE ERROR FOR PRODUCTION ******************/
const handleCastError = (err) => {
  err = new AppError(`Invalid ${err.path}. Please try again with a valid one`, 400);
  err.status = 'fail';
  return err;
};

const handleDuplicateError = (err) => {
  const value = err.errmsg.match(/(["'])((\\{2})*|(.*?[^\\](\\{2})*))\1/)[0];
  //   console.log(value);
  err = new AppError(`A product with name ${value} already exists. Please try with another name`, 400);
  err.status = 'fail';
  return err;
};

const handleValidationEror = (err) => {
  //   console.log(err.errors.name);
  let errors = [];
  for (let errName in err.errors) {
    errors.push(err.errors[errName].message);
  }

  let message = errors.join('. ');

  err = new AppError(message, 400);
  err.status = 'fail';

  return err;
};

const handleJWTError = (err) => {
  err = new AppError('Invalid token. Please login again to gain access!', 401);
  err.status = 'fail';

  return err;
};

const handleJWTExpired = (err) => {
  err = new AppError('Your token has expired. Please login again to gain access!', 401);
  err.status = 'fail';

  return err;
};

/**************** SENDING ERROR IN DEVELOPMENT AND PRODUCTIONS **********************/

// SEND ERROR IN DEVELOPMENT
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    err,
  });
};

// SEND ERROR IN PRODUCTION
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // console.log(err);
    res.status(err.statusCode).json({
      status: err.status,
      message: 'Something went wrong. Please try again later or write us about this',
    });
  }
};

module.exports = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.status = err.status || 'error';
  error.statusCode = error.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError') error = handleCastError(error);

    if (error.code === 11000) error = handleDuplicateError(error);

    if (error.name === 'ValidationError') error = handleValidationEror(error);

    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);

    if (error.name === 'TokenExpiredError') error = handleJWTExpired(error);

    sendErrorProd(error, res);
  }
};
