const express = require('express');

const productController = require('./../controllers/productController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(productController.getAllProducts)
  .post(authController.protect, authController.restrictTo(['admin']), productController.createProduct);

router.get('/:id', productController.getProductById);

router.use(authController.protect, authController.restrictTo(['admin']));
router.route('/:id').patch(productController.updateProduct).delete(productController.deleteProduct);

router.get('/add-category/:name', productController.createNewCategory);
router.patch('/delete-category/:name', productController.deleteCategory);
router.get('/categorise-all/:categoryName', productController.categoriseAllUncategorisedProducts);

module.exports = router;
