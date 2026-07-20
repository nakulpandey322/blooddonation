import User from "../models/User.js";

export const searchDonors = async (req, res, next) => {
  try {
    const { bloodGroup, city, page = 1, limit = 10 } = req.query;
    const filter = { role: "donor", isAvailable: true };
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (city) filter.city = new RegExp(city, "i");

    const skip = (Number(page) - 1) * Number(limit);
    const [donors, total] = await Promise.all([
      User.find(filter).select("name bloodGroup city rewardPoints totalDonations isVerified").skip(skip).limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    res.json({ success: true, donors, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
  } catch (err) {
    next(err);
  }
};

export const toggleAvailability = async (req, res, next) => {
  try {
    req.user.isAvailable = !req.user.isAvailable;
    await req.user.save({ validateBeforeSave: false });
    res.json({ success: true, isAvailable: req.user.isAvailable });
  } catch (err) {
    next(err);
  }
};

export const updateLocation = async (req, res, next) => {
  try {
    const { lat, lng } = req.body;
    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ success: false, message: "lat and lng required" });
    }
    req.user.location = { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] };
    await req.user.save({ validateBeforeSave: false });
    res.json({ success: true, location: req.user.location });
  } catch (err) {
    next(err);
  }
};

export const leaderboard = async (req, res, next) => {
  try {
    const donors = await User.find({ role: "donor" })
      .select("name city bloodGroup rewardPoints totalDonations")
      .sort({ rewardPoints: -1 })
      .limit(20);
    res.json({ success: true, leaderboard: donors });
  } catch (err) {
    next(err);
  }
};
