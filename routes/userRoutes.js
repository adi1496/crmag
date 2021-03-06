const express = require('express');

const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const router = express.Router();

router.route('/am-i-logged').get(authController.protect, authController.amILogged);
router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

router.route('/forgot-password').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);
router
  .route('/updateMyPassword')
  .patch(authController.protect, authController.updateMyPassword);

router.route('/updateMe').patch(authController.protect, authController.updateMe);

router.use(authController.protect, authController.restrictTo(['admin']));

router.route('/').get(userController.getAllUsers).post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUserById)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
