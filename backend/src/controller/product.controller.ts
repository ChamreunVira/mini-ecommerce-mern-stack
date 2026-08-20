import { Request, Response } from "express";
import Product from "../models/product.models.js";

export const productController = {
  create: async (req: Request, res: Response) => {
    const {
      name,
      images,
      description,
      price,
      quantity,
      discount,
      variants,
      category,
    } = req.body;

    switch (true) {
      case !name:
        return res.status(400).json({
          message: "Name is required.",
        });

      case !images:
        return res.status(400).json({
          message: "Images are required.",
        });

      case !description:
        return res.status(400).json({
          message: "Description is required.",
        });

      case price === undefined:
        return res.status(400).json({
          message: "Price is required.",
        });

      case quantity === undefined:
        return res.status(400).json({
          message: "Quantity is required.",
        });

      case !variants || !Array.isArray(variants) || variants.length === 0:
        return res.status(400).json({
          message: "At least one variant is required.",
        });

      case !category:
        return res.status(400).json({
          message: "Category is required.",
        });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      images,
      quantity,
      discount,
      variants,
      category,
    });

    const product = await newProduct.save();

    return res.status(201).json({
      message: "Product is created successfully.",
      data: product,
    });
  },

  getAll: async (req: Request, res: Response) => {
    const products = await Product.find();

    res.status(200).json({
      message: "Successfully to retrieve all products.",
      data: products,
    });
  },
};
