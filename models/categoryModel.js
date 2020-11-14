const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: [true, 'The category name is required'],
    unique: [true, 'Every category has a unique name'],
    trim: true,
    lowercase: true,
  },
  items: {
    type: Number,
    default: 0,
  },
  image: String,
});

categorySchema.pre('save', function (next) {
  if (!this.isModified) next();
  this.categoryName = this.categoryName.split(' ').join('-');

  next();
});

categorySchema.methods.updateCategoryItemsCount = function (state) {
  if (state === 'increase') {
    this.items++;
  } else if (state === 'decrease') {
    this.items--;
  }
};

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
