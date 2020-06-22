const mongoose = require('mongoose');

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
    type: String,
    required: [true, 'A product must belong to a category'],
    enum: ['phone', 'tv', 'laptop', 'pc-components', 'tablet', 'gaming-console'],
  },
  summary: {
    type: String,
    required: [true, 'Aproduct must have a summary'],
  },
  description: {
    type: String,
  },
  ratingsAverage: {
    type: Number,
    min: [1, 'The rating average must be minimum 1'],
    max: [5, 'The artings average must be maximum 5'],
  },
  ratingsQuantity: {
    type: Number,
  },
  imageCover: String,
  images: [String],
  createdAt: Date,
});

productSchema.pre('save', function (next) {
  if (this.isNew) {
    this.createdAt = Date.now();
    this.slug = this.name.split(' ').join('-');
  }

  next();
});

productSchema.pre(/^find/, function (next) {
  this.select('-__v');
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
