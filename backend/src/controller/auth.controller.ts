import { Request, Response } from "express";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/index.js";
import { AppError } from "../types/AppError.js";

export const authController = {
  register: async (req: Request, res: Response) => {
    const { firstname, lastname, email, password } = req.body;

    switch (true) {
      case !firstname:
        return res.status(200).json({
          message: "Firstname is requried.",
        });
      case !lastname:
        return res.status(200).json({
          message: "Lastname is required.",
        });
      case !email:
        return res.status(200).json({
          message: "Email is required.",
        });
      case !password:
        return res.status(200).json({
          message: "Password is user required.",
        });
    }

    const existsUser = await User.findOne({ email });

    if (existsUser) {
      throw new AppError(400, "Email is already exists.");
    }

    console.log("Function work normal when didn't used return.");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstname,
      lastname,
      email,
      hashPassword: hashedPassword,
    });

    const user = await newUser.save();

    const token = generateToken(user._id, user.isAdmin);

    res.status(200).json({
      message: "Register successfully.",
      data: user,
      token: token,
    });
  },

  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        message: "Email and Password are required.",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      const isMatched = await bcrypt.compare(password, user.hashPassword);

      if (isMatched) {
        const token = generateToken(user._id, user.isAdmin);
        res.status(200).json({
          message: "Logged in successfully.",
          token,
          data: user,
        });
      } else {
        throw new AppError(400, "Email or Password invalid.");
      }
    } else {
      throw new AppError(400, "Email not found!");
    }
  },
};
