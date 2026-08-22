import { Request, Response } from "express";
import Product from "../models/product.models.js";
import Category from "../models/category.model.js";
import { PaginationResponse } from "../types/Pagination.js";
import { AppError } from "../types/AppError.js";

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

    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      throw new AppError(404, "Category not found.");
    }

    if (!existingCategory.status) {
      throw new AppError(400, "Category is in active.");
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
    let page = parseInt(req.query.page as string, 10);
    let limit = parseInt(req.query.limit as string, 10);

    console.log(page, limit);

    if (isNaN(page) || page <= 0) page = 0;
    if (isNaN(limit) || limit <= 0) limit = 10;

    const skip = (page - 1) * limit;

    console.log(skip);

    const [products, totalItems] = await Promise.all([
      Product.find().skip(skip).limit(limit),
      Product.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    const response: PaginationResponse<(typeof products)[0]> = {
      success: true,
      data: products,
      meta: {
        totalItems,
        totalPages,
        currentPage: page,
        limit,
        hasPrevPage: page < totalPages,
        hasNextPage: 1 < totalPages,
      },
    };

    res.status(200).json({
      message: "Successfully to retrieve all products.",
      data: response,
    });
  },

  filterPrice: async (req: Request, res: Response) => {
    const minPrice =
      req.query.minPrice !== undefined ? Number(req.query.minPrice) : 0;
    const maxPrice =
      req.query.maxPrice !== undefined
        ? Number(req.query.maxPrice)
        : Number.POSITIVE_INFINITY;

    if (Number.isNaN(minPrice) || Number.isNaN(maxPrice)) {
      return res.status(400).json({
        status: false,
        message: "Invalid price filter values.",
      });
    }

    const products = await Product.find({
      price: {
        $gte: minPrice,
        $lte: maxPrice,
      },
    });

    return res.status(200).json({
      status: true,
      message: "Successfully retrieved products by price range.",
      data: products,
    });
  },

  update: async (req: Request, res: Response) => {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) throw new AppError(404, "Product not found.");
  },

  delete: async (req: Request, res: Response) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: true,
      message: "Product was deleted sucessfully.",
    });
  },

  createVariant: async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { color, size, price, quantity, image } = req.body;

    switch (true) {
      case !color:
        return res.status(400).json({ message: "Color is required." });
      case !size:
        return res.status(400).json({ message: "Size is required." });
      case price === undefined:
        return res.status(400).json({ message: "Price is required." });
      case quantity === undefined:
        return res.status(400).json({ message: "Quantity is required." });
      case !image:
        return res.status(200).json({ message: "Image is required." });
    }

    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not founnd.");

    product.variants.push({
      color,
      size,
      price,
      quantity,
      image,
    } as any);

    const savedProduct = await product.save();
    res.status(201).json({
      message: "Product variant was created.",
      data: savedProduct,
    });
  },

  updateVaraint: async (req: Request, res: Response) => {
    const {req.}
  }
};
