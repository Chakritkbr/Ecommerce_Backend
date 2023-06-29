import express from 'express';
import {
  loginController,
  protectedRouteAuth,
  registerController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
} from '../controllers/authControllers.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Regist : Post
router.post('/register', registerController);
// Regist : Post
router.post('/login', loginController);
//test routes
router.get('/test', requireSignIn, isAdmin, testController);
// Forgot  Password : Post
router.post('/forgot-password', forgotPasswordController);
// Protected User routes auth
router.get('/user-auth', requireSignIn, protectedRouteAuth);
// Protected Admin routes auth
router.get('/admin-auth', requireSignIn, isAdmin, protectedRouteAuth);
//update profile
router.put('/profile', requireSignIn, updateProfileController);
//orders
router.get('/orders', requireSignIn, getOrdersController);
//all orders
router.get('/all-orders', requireSignIn, isAdmin, getAllOrdersController);
//order status
router.put(
  '/order-status/:orderId',
  requireSignIn,
  isAdmin,
  orderStatusController
);

export default router;
