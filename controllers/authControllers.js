import Usermodel from '../models/Usermodel.js';
import Ordermodel from '../models/Ordermodel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    if (!name) {
      return res.send({ message: 'Name is required' });
    }
    if (!email) {
      return res.send({ message: 'Email is required' });
    }
    if (!password) {
      return res.send({ message: 'Password is required' });
    }
    if (!phone) {
      return res.send({ message: 'Phone is required' });
    }
    if (!address) {
      return res.send({ message: 'Address is required' });
    }
    if (!answer) {
      return res.send({ message: 'Answer is required' });
    }
    //exists user checked
    const userCheck = await Usermodel.findOne({ email });
    if (userCheck) {
      return res.status(200).send({
        success: false,
        message: 'Already Register please login',
      });
    }
    // register user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Usermodel({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      answer,
    });
    const savedUser = await newUser.save();
    res.status(201).send({
      success: true,
      message: 'User Register Successfully',
      savedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: 'Errro in Registeration',
      err,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: 'Invalid email or password',
      });
    }
    const user = await Usermodel.findOne({ email });
    if (!user)
      return res.status(404).send({
        success: false,
        message: 'Email is not registerd',
      });
    //   match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(200).send({
        success: false,
        message: 'Invalid Credential',
      });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    delete user.password;
    res.status(200).send({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
      success: true,
      message: 'login successfully',
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: 'Error in login',
      err,
    });
  }
};

export const testController = (req, res) => {
  res.send('protected routes');
};

export const protectedRouteAuth = (req, res) => {
  res.status(200).send({ ok: true });
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: 'Emai is required' });
    }
    if (!answer) {
      res.status(400).send({ message: 'answer is required' });
    }
    if (!newPassword) {
      res.status(400).send({ message: 'New Password is required' });
    }
    //check
    const user = await Usermodel.findOne({ email, answer });
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'Wrong Email Or Answer',
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await Usermodel.findByIdAndUpdate(user._id, { password: hashedPassword });
    res.status(200).send({
      success: true,
      message: 'Password Reset Successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Something went wrong',
      error,
    });
  }
};

//update prfole
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await Usermodel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: 'Passsword is required and 6 character long' });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const hashedPassword = password ? hashPassword : undefined;
    const updatedUser = await Usermodel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: 'Profile Updated SUccessfully',
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: 'Error While Update profile',
      error,
    });
  }
};

export const getOrdersController = async (req, res) => {
  try {
    const orders = await Ordermodel.find({ buyer: req.user._id })
      .populate('products', '-photo')
      .populate('buyer', 'name');
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error While Getting Orders',
      error,
    });
  }
};

export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await Ordermodel.find({})
      .populate('products', '-photo')
      .populate('buyer', 'name')
      .sort({ createdAt: '-1' });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error While Getting Orders',
      error,
    });
  }
};

export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await Ordermodel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error While Updating Orders',
      error,
    });
  }
};
