const express = require('express');

const categoryController = require('./../controllers/categoryController');

const router = express.Router();

router.route('/').get(categoryController.getAllCategories);

router.get('/add-category/:name', categoryController.createNewCategory);
router.patch('/delete-category/:name', categoryController.deleteCategory);
router.get('/categorise-all/:categoryName', categoryController.categoriseAllUncategorisedProducts);


module.exports = router;