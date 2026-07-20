import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";
import jwt from "jsonwebtoken";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

const sendAuthResponse = async (res, user, statusCode) => {
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie("refreshToken", refreshToken, cookieOptions);

  res.status(statusCode).json({
    success: true,
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      bloodGroup: user.bloodGroup,
      city: user.city,
      isVerified: user.isVerified,
      rewardPoints: user.rewardPoints,
    },
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role, bloodGroup, city, lat, lng } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email or phone already registered" });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: role || "donor",
      bloodGroup,
      city,
      location:
        lat && lng ? { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] } : undefined,
    });

    await sendAuthResponse(res, user, 201);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    await sendAuthResponse(res, user, 200);
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ success: false, message: "No refresh token" });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select("+refreshToken");

    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ success: false, message: "Invalid refresh token" });
    }

    const accessToken = generateAccessToken(user._id, user.role);
    res.json({ success: true, accessToken });
  } catch (err) {
    return res.status(401).json({ success: false, message: "Refresh token expired or invalid" });
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      await User.findOneAndUpdate({ refreshToken: token }, { refreshToken: null });
    }
    res.clearCookie("refreshToken", cookieOptions);
    res.json({ success: true, message: "Logged out" });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};
