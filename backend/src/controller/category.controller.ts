import { Request, Response } from "express";
import Category from "../models/category.model.js";
import { AppError } from "../types/AppError.js";

export const categoryController = {
  create: async (req: Request, res: Response) => {
    const { name, description } = req.body;

    if (!name) {
      throw new AppError(400, "Category name is required.");
    }

    if (!req.file) {
      throw new AppError(400, "Category image is required.");
    }

    const newCategory = new Category({
      name,
      image: req.file.filename,
      description,
    });

    const category = await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully.",
      data: category,
    });
  },

  getAll: async (req: Request, res: Response) => {

    const status = req.query.status;

    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "category",
          as: "products"
        }
      }
    ]);

    res.status(200).json({
      success: true,
      message: "Successfully retrieved all categories.",
      data: categories,
    });
  },

  getById: async (req: Request, res: Response) => {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      throw new AppError(404, "Category not found.");
    }

    res.status(200).json({
      success: true,
      message: "Successfully retrieved category.",
      data: category,
    });
  },

  update: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, status } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      throw new AppError(404, "Category not found.");
    }

    if (name !== undefined) category.name = name;
    if (description !== undefined) category.description = description;
    if (status !== undefined) category.status = status;
    if (req.file) category.image = req.file.filename;

    const updatedCategory = await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      data: updatedCategory,
    });
  },

  updateStatus: async (req: Request, res: Response) => {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) throw new AppError(404, "Category not found!");
    category.status = !category.status;

    const savedCategory = await category.save();

    res.status(200).json({
      success: false,
      message: "Update status category successfully.",
      data: savedCategory,
    });
  },
};
