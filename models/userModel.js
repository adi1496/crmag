const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto-js');

const myAlgos = require('./../utils/myalgos');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [
      validator.isEmail,
      'This is not an valid email address, please provide an valide addreess'
    ]
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'The password must contain minimum 8 characters'],
    select: false
  },
  confirmPassword: {
    type: String,
    required: true,
    validate: {
      validator: function (thisElement) {
        return thisElement === this.password;
      },
      message: 'Passwords are not the same!'
    },
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'support', 'sales-agent'],
    default: 'user'
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpiresIn: Date
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
  this.passwordChangedAt = Date.now() - 1000;

  next();
});

// METHODS FOR SCHEMA
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function () {
  const randomBytes = myAlgos.createRandomChars(40);
  const resetToken = crypto.SHA256(randomBytes).toString();

  this.passwordResetToken = resetToken;
  this.passwordResetTokenExpiresIn = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.resetPassword = function (password, confirmPassword) {
  this.password = password;
  this.confirmPassword = confirmPassword;

  this.passwordResetToken = undefined;
  this.passwordResetTokenExpiresIn = undefined;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
