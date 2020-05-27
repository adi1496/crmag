const catchAsync = require('./../utils/catchAsync');
const Product = require('./../models/productModel');
const AppError = require('./../utils/AppError');

/***************** WITHOUT ANY PARAMETER **********************/

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find();

  if (!products) {
    return next(new AppError('The products cannot be found', 400));
  }

  res.status(200).json({
    status: 'success',
    data: {
      products,
    },
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  // console.log(req.body);
  const newProduct = await Product.create({
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    summary: req.body.summary,
    description: req.body.description,
    imageCover: req.res.body,
    images: req.body.images,
    ratingsAverage: req.body.ratingsAverage,
    ratingsQuantity: req.body.ratingsQuantity,
  });

  res.status(200).json({
    status: 'success',
    data: {
      product: newProduct,
    },
  });
});

/***************** WITH ID PARAMETER **********************/

exports.getProductById = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  // solve the cast error

  if (!product) return next(new AppError('This is not a valid id. Pleases try again with a valid id', 400));

  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) return next(new AppError('There is no product with this id. Please try again with a valid id', 400));

  res.status(200).json({
    stauts: 'success',
    data: {
      product,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  await Product.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
