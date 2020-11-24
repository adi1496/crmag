const catchAsync = require('./../utils/catchAsync');
const Product = require('./../models/productModel');
const Category = require('./../models/categoryModel');
const AppError = require('./../utils/AppError');

const getSetCategory = require('./../utils/get-set-category-data.js');

/***************** WITHOUT ANY PARAMETER **********************/

/*****************************
 * GET ALL PRODUCTS FROM DATABASE
 *  *************************/
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

/*****************************
 * CREATE NEW PRODUCT
 *  *************************/
exports.createProduct = catchAsync(async (req, res, next) => {
  // console.log(req.body);
  const category = await Category.findOne({ categoryName: req.body.category });
  if (!category)
    return next(
      new AppError(
        'The provided category does not exists, please provide a valid category or create a new one before',
        400
      )
    );

  const newProduct = await Product.create({
    name: req.body.name,
    price: req.body.price,
    category: category._id,
    summary: req.body.summary,
    description: req.body.description,
    imageCover: req.body.imageCover,
    images: req.body.images,
    ratingsAverage: req.body.ratingsAverage,
    ratingsQuantity: req.body.ratingsQuantity,
  });

  if (!newProduct) return next(new AppError('The product was not created, please try again', 400));
  await category.updateCategoryItemsCount('increase');
  await category.save();

  res.status(200).json({
    status: 'success',
    data: {
      product: newProduct,
    },
  });
});

/***************** WITH ID PARAMETER **********************/

/*****************************
 * GET A PRODUCT BY ID
 *  *************************/
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

/*****************************
 * UPDATE A PRODUCT BY ID
 *  *************************/
exports.updateProduct = catchAsync(async (req, res, next) => {
  if (!req.params.id) return next(new AppError('Please provide the id in order to find the product', 400));

  if (req.body.category) {
    const oldProduct = await Product.findById(req.params.id);
    const oldCategory = await Category.findById(oldProduct.category);
    const newCategory = await Category.findOne({ categoryName: req.body.category });
    if (!newCategory)
      return next(
        new AppError('This category does not exists, please try again with a valid category or create a new one', 400)
      );

    oldCategory.updateCategoryItemsCount('decrease');
    oldCategory.save();
    newCategory.updateCategoryItemsCount('increase');
    newCategory.save();
    req.body.category = newCategory._id;
  }

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

/*****************************
 * DELETE A PRODUCT
 *  *************************/
exports.deleteProduct = catchAsync(async (req, res, next) => {
  if (!req.params.id) return next(new AppError('Please provide the id of product in order to delete it', 400));
  const product = await Product.findById(req.params.id);
  const category = await Category.findById(product.category);
  category.updateCategoryItemsCount('decrease');
  category.save();

  console.log(category);
  await Product.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});


exports.getProductsByCategory = catchAsync(async(req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category)
    return next(
      new AppError(
        'The provided category does not exists, please provide a valid category or create a new one before',
        400
      )
    );

  const products = await Product.find({category: req.params.id});

  if (!products) {
    return next(new AppError('The products cannot be found', 400));
  }

  res.status(200).json({
    status: 'success',
    data: {
      category,
      products,
    },
  });
});