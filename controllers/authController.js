const jwt = require('jsonwebtoken');

const AppError = require('./../utils/AppError');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');

const createJWT = (id) => {
  token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

  return token;
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  if (!newUser) return next(new AppError('The user was not created. Please try again!', 400));

  const token = createJWT(newUser._id);

  newUser.password = undefined;
  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
      token,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  if (!req.body.password || !req.body.email) return next(new AppError('Please provide the email and password', 400));

  const user = await User.findOne({ email: req.body.email }).select('+password');

  console.log(await user.correctPassword(req.body.password, user.password));

  if (!user || (await user.correctPassword(req.body.password, user.password)) === false)
    return next(new AppError('Email or password is not correct', 401));

  const token = createJWT(user._id);
  if (!token) return next(new AppError('Log-in failed. Please try again', 400));

  res.status(200).json({
    status: 'success',
    data: {
      token,
    },
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  if(!req.headers.authorization) return next(new AppError('You are not logged in. Please log in to have access', 401));
  let token = req.headers.authorization;
  if (token.startsWith('Bearer')) token = token.split(' ')[1];

  if (!token) return next(new AppError('You are not loged in. Please log in to have access', 401));


  const user = await User.findById(decoded.id);
  if (!user) return next(new AppError('This user no longer exists', 401));

  console.log(user);
  //FINISH THE JOB HERE
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError('There is no user with this email address', 400));
  console.log(user);

  resetToken = user.creaetPasswordResetToken();
  await user.save({ runValidators: true });

  console.log(resetToken);
});
