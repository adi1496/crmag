const jwt = require('jsonwebtoken');

const AppError = require('./../utils/AppError');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const createSendMail = require('./../utils/email');

const createJWT = (id) => {
  token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  return token;
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  });

  if (!newUser)
    return next(new AppError('The user was not created. Please try again!', 400));

  const token = createJWT(newUser._id);

  newUser.password = undefined;
  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
      token
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  if (!req.body.password || !req.body.email)
    return next(new AppError('Please provide the email and password', 400));

  const user = await User.findOne({ email: req.body.email }).select('+password');

  if (!user || (await user.correctPassword(req.body.password, user.password)) === false)
    return next(new AppError('Email or password is not correct', 401));

  const token = createJWT(user._id);
  if (!token) return next(new AppError('Log-in failed. Please try again', 400));

  res.status(200).json({
    status: 'success',
    data: {
      token
    }
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  if (!req.headers.authorization)
    return next(new AppError('You are not logged in. Please log in to have access', 401));

  let token = req.headers.authorization;
  if (token.startsWith('Bearer')) token = token.split(' ')[1];

  if (!token)
    return next(new AppError('You are not loged in. Please log in to have access', 401));

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);
  if (!user) return next(new AppError('This user no longer exists', 401));
  const passwordChangedAtTS = parseInt(user.passwordChangedAt.getTime() / 1000, 10);

  if (decoded.iat < passwordChangedAtTS)
    return next(
      new AppError('The password was changed recently. Please login again!', 401)
    );
  if (decoded.exp < parseInt(Date.now() / 1000, 10))
    return next(new AppError('Your JWT has expired. Please login again!', 401));

  req.user = user;
  next();
  //FINISH THE JOB HERE
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError('There is no user with this email address', 400));

  resetToken = user.createPasswordResetToken();
  await user.save({ runValidators: true });
  const message = `This is your password reset token valid for only 10 minutes: ${resetToken}\n Hurry up and change the password!`;

  // await createSendMail(message, req.body.email);

  res.status(200).json({
    status: 'success',
    resetToken
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  if (req.body.password !== req.body.confirmPassword)
    return next(new AppError('Passwords are not the same! Please try again', 400));

  const user = await User.findOne({ passwordResetToken: req.params.token });
  if (!user)
    return next(
      new AppError(
        "Didn't find any user with this token. Please provide a valid one",
        400
      )
    );

  if (Date.now() < user.passwordResetTokenExpiresIn) {
    user.resetPassword(req.body.password, req.body.confirmPassword);
  } else {
    return next(new AppError('The token has expired. Try again with a valid token', 400));
  }
  await user.save({ runValidators: true });

  res.status(200).json({
    status: 'success',
    message: 'The password was sucessfully changed!'
  });
});

exports.updateMyPassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');
  if ((await user.correctPassword(req.body.password, user.password)) === false)
    return next(new AppError('The old password is not correct. Please try again', 401));

  user.password = req.body.newPassword;
  user.confirmPassword = req.body.newPasswordConfirm;
  await user.save({ runValidators: true });

  const token = createJWT(user._id);
  if (!token)
    return next(
      new AppError('Password was updated, but login failed. Please login again', 500)
    );

  res.status(200).json({
    status: 'success',
    message: 'Password updated successfully',
    data: {
      token
    }
  });
});
