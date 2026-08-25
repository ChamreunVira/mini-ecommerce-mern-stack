import { Request, Response } from "express";
import Product, { IProductVariant } from "../models/product.models.js";
import Category from "../models/category.model.js";
import { PaginationResponse } from "../types/Pagination.js";
import { AppError } from "../types/AppError.js";
import { generateSku } from "../utils/index.js";

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

    normalizeVaraints(name , variants);

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
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
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
      variantSku: generateSku(product.name, color, size),
      price,
      quantity,
      image,
    } as any);

    const savedProduct = await product.save();
    const newVaraints = savedProduct.variants[product.variants.length - 1];
    res.status(201).json({
      message: "Product variant was created.",
      data: newVaraints,
    });
  },

  updateVaraint: async (req: Request, res: Response) => {
    const { productId, variantId } = req.params;
    const { color, size, price, quantity, image } = req.body;

    const product = await Product.findById(productId);
    if (!product) throw new AppError(404, "Product not found.");

    const variants = product.variants.find(
      (variant) => variant._id.toString() === variantId,
    );

    if (!variants) {
      throw new AppError(404, "Variant not found.");
    }

    if (color !== undefined) {
      variants.color = color;
    }

    if (size !== undefined) {
      variants.size = size;
    }

    if (price !== undefined) {
      variants.price = price;
    }

    if (quantity !== undefined) {
      variants.quantity = quantity;
    }

    if (image !== undefined) {
      variants.image = image;
    }

    await product.save();

    const updatedVaraint = product.variants[product.variants.length - 1];

    res.status(200).json({
      message: "Product variant updated successfully.",
      data: updatedVaraint,
    });
  },

  deleteVaraint: async (req: Request, res: Response) => {
    const { productId, variantId } = req.params;
    const product = await Product.findById(productId);

    if (!product) throw new AppError(404, "Product not found.");

    const newVaraints = product.variants.filter(
      (varaint) => varaint._id.toString() !== variantId,
    );

    product.variants = newVaraints;

    await product.save();

    res.status(200).json({
      message: "Product varaint was deleted successfully"
    });
  },
};

const normalizeVaraints = (name: string, varaints: IProductVariant[]) => {
  varaints.forEach(varaint => {
    varaint.variantSku = generateSku(name, varaint.color, varaint.size);
  })
}