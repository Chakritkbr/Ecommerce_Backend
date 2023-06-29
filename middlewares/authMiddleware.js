import jwt from 'jsonwebtoken';
import Usermodel from '../models/Usermodel.js';

//Protected Routes token base

export const requireSignIn = async (req, res, next) => {
  try {
    const decode = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};

//admin acceess
export const isAdmin = async (req, res, next) => {
  try {
    const user = await Usermodel.findById(req.user._id);
    console.log(user.role);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: 'UnAuthorized Access',
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: 'Error in admin middelware',
    });
  }
};