const catchAsync = require('./../utils/catchAsync');
const Product = require('./../models/productModel');
const Category = require('./../models/categoryModel');
const AppError = require('./../utils/AppError');


/*****************************
 * CREATE A NEW CATEGORY
 *  *************************/
exports.createNewCategory = catchAsync(async (req, res, next) => {
    if (!req.params.name) return next(new AppError('Please send the name of the new category', 404));
  
    const newCategory = await Category.create({
      categoryName: req.params.name,
    });
  
    if (!newCategory) return next(new AppError('The new category was not created, please try again', 400));
  
    res.status(200).json({
      status: 'sucess',
      message: 'The category has been added',
    });
  });
  
  /*****************************
   * DELETE A CATEGORY
   *  *************************/
  exports.deleteCategory = catchAsync(async (req, res, next) => {
    if (!req.params.name) return next(new AppError('Please send the name of the new category', 404));
  
    const category = await Category.findOne({ categoryName: req.params.name });
    if (!category) return next(new AppError('Please try again with a valid category', 400));
  
    if (req.body.deleteProducts) {
      if (category.items > 0) await Product.deleteMany({ category: category._id });
    } else {
      const newCategory = await Category.findOne({ categoryName: 'uncategorized' });
      const products = await Product.find({ category: category._id });
  
      newCategory.items += products.length;
      newCategory.save();
  
      await Promise.all(
        products.map(async (product) => {
          product.category = newCategory._id;
          await product.save();
          return product;
        })
      );
    }
  
    await Category.deleteOne({ categoryName: req.params.name });
  
    res.status(204).json({
      status: 'sucess',
      message: 'The category has been deleted',
    });
  });
  
  /*****************************
   * DELETE A CATEGORY
   *  *************************/
  exports.categoriseAllUncategorisedProducts = catchAsync(async (req, res, next) => {
    if (!req.params.categoryName) return next(new AppError('Please send the name of the new category', 404));
  
    const oldCategory = await Category.findOne({ categoryName: 'uncategorized' });
    if (!oldCategory) return next(new AppError('Could not find the old category', 404));
  
    const newCategory = await Category.findOne({ categoryName: req.params.categoryName });
    if (!oldCategory)
      return next(new AppError('Could not find this category, please try again with a valid category', 400));
  
    const products = await Product.find({ category: oldCategory._id });
    if (products.length === 0) return next(new AppError('There are no products uncategorized', 400));
  
    oldCategory.items = 0;
    oldCategory.save();
  
    newCategory.items += products.length;
    newCategory.save();
  
    await Promise.all(
      products.map(async (product) => {
        product.category = newCategory;
        await product.save({ runValidators: true });
      })
    );
  
    res.status(200).json({
      status: 'success',
      message: `All uncategorised products belong now to "${newCategory.categoryName}" category`,
    });
  });
  
  
  exports.getAllCategories = catchAsync(async(req, res, next) => {
    const categories = await Category.find();
  
    if(categories.length === 0 || !categories) return next(new AppError('No categories found, please try again', 404));
  
    res.status(200).json({
      status: 'success',
      categories
    });
  })