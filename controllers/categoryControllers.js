import Categorymodel from '../models/Categorymodel.js';
import slugify from 'slugify';
import Productmodel from '../models/Productmodel.js';

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({ message: 'Name is required' });
    }
    const existingCategory = await Categorymodel.findOne({ name });
    if (existingCategory) {
      return req.status(200).send({
        success: true,
        message: 'Category Already exist',
      });
    }
    const category = await new Categorymodel({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: 'New Category created',
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: 'Error in Category',
    });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await Categorymodel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      messsage: 'Category Updated Successfully',
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: 'Error while updating category',
    });
  }
};

export const categoryController = async (req, res) => {
  try {
    const category = await Categorymodel.find({});
    res.status(200).send({
      success: true,
      messsage: 'All Category List',
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: 'Error while getting category',
    });
  }
};

export const singleCategoryController = async (req, res) => {
  try {
    const category = await Categorymodel.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: 'Get Single Category Successfully',
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: 'Error While getting Single Category',
    });
  }
};

export const deleteCategoryCOntroller = async (req, res) => {
  try {
    const { id } = req.params;
    await Categorymodel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: 'Categry Deleted Successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'error while deleting category',
      error,
    });
  }
};
