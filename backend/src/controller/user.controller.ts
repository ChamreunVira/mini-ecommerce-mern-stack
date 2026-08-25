import { Request, Response } from "express";
import User from "../models/user.model.js";
import { AppError } from "../types/AppError.js";

export const userController = {
  create: async (req: Request, res: Response) => {},
  getAll: async (req: Request, res: Response) => {},
  update: async (req: Request, res: Response) => {},
  delete: async (req: Request, res: Response) => {},
  readAddresses: async (req: Request, res: Response) => {
    const user = await User.findById(req.user?._id);
    if (!user) throw new AppError(404, "User not found.");

    const addresses = [...(user.addresses || [])].sort(
      (a, b) => Number(b.isDefault) - Number(a.isDefault),
    );

    res.status(200).json({
      message: "Successfuly to retreive addresses.",
      data: addresses,
    });
  },
  createAddress: async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { phone, address, city, province, country, isDefault } = req.body;

    switch (true) {
      case phone === null:
        return res.status(200).json({ message: "Phone is rquired." });
      case address === null:
        return res.status(200).json({ message: "Address is required." });
      case city === null && province == null:
        return res
          .status(200)
          .json({ message: "City or Province are required." });
      case country === null:
        return res.status(200).json({ message: "Country is required." });
    }

    const user = await User.findById(userId);
    if (!user) throw new AppError(404, "User not found.");

    user.addresses?.push({
      phone,
      address,
      city,
      province,
      country,
      isDefault,
    } as any);

    await user.save();

    const newAddress = user.addresses?.[user.addresses.length - 1];

    res.status(201).json({
      message: "Address have been created.",
      data: newAddress,
    });
  },

  updateAddress: async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { addressId } = req.params;
    const user = await User.findById(userId);

    const { phone, address, city, province, country, isDefault } = req.body;

    if (!user) throw new AppError(404, "User not found.");
    const existingAddress = user.addresses?.find(
      (address) => address._id.toString() === addressId,
    );

    if (!existingAddress) throw new AppError(404, "Address not found.");

    if (phone !== undefined) {
      existingAddress.phone = phone;
    }

    if (address !== undefined) {
      existingAddress.address = address;
    }

    if (city !== undefined) {
      existingAddress.province = province;
    }

    if (country !== undefined) {
      existingAddress.country = country;
    }

    if (isDefault !== undefined) {
      if (isDefault) {
        user.addresses?.forEach((address) => (address.isDefault = false));
      }
      existingAddress.isDefault = isDefault;
    }

    await user.save();

    res.status(200).json({
      message: "Updated address successfully.",
      data: existingAddress,
    });
  },

  updateStatus: async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { addressId } = req.params;
    const user = await User.findById(userId);
    if (!user) throw new AppError(404, "User not found.");

    const newAddress = user.addresses?.find(
      (address) => address._id.toString() === addressId,
    );

    if (!newAddress) throw new AppError(404, "Address not found.");

    user.addresses?.forEach((address) => (address.isDefault = false));

    newAddress.isDefault = !newAddress?.isDefault;

    await user.save();

    res.status(200).json({
      message: "Status updated successfully.",
      data: newAddress,
    });
  },

  deleteAddress: async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { addressId } = req.params;
    const user = await User.findById(userId);
    if (!user) throw new AppError(404, "User not found.");

    const newAddresses = user.addresses?.filter(
      (address) => address._id.toString() !== addressId,
    );

    user.addresses = newAddresses;
    console.log(user.addresses);

    await user.save();

    res.status(200).json({
      message: "Address delete successfully.",
    });
  },
};
