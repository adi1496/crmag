const mongoose = require('mongoose');

const getSetCategory = require('../utils/get-set-category-data');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: [true, 'The product name must be unique'],
    trim: true,
    required: [true, 'A product must have a name'],
  },
  slug: {
    type: String,
    lowercase: true,
  },
  price: {
    type: String,
    required: [true, 'A product must have a price'],
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'A product must belong to a category'],
  },
  summary: {
    type: String,
    required: [true, 'Aproduct must have a summary'],
  },
  description: {
    type: String,
  },
  characteristics: [
    {
      type: Array,
    }
  ],
  ratingsAverage: {
    type: Number,
    min: [1, 'The rating average must be minimum 1'],
    max: [5, 'The artings average must be maximum 5'],
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  secretProduct: {
    type: Boolean,
    default: false,
  },
  imageCover: String,
  images: [String],
  createdAt: Date,
});

productSchema.pre('save', function (next) {
  if (this.isNew) {
    this.createdAt = Date.now();
    this.slug = this.summary.split(' ').join('-');
  }

  next();
});

productSchema.pre(/^find/, function (next) {
  this.select('-__v');
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
