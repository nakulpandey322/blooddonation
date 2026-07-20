import BloodRequest from "../models/BloodRequest.js";
import User from "../models/User.js";
import { compatibleDonorGroups } from "../utils/bloodCompatibility.js";

// Core matching engine: finds eligible, available, compatible donors near the request,
// expanding the search radius automatically if too few donors are found.
const findMatchingDonors = async (request, { maxRadiusKm = 50 } = {}) => {
  const groups = compatibleDonorGroups(request.bloodGroup);
  let radius = request.searchRadiusKm || 10;
  let donors = [];

  while (radius <= maxRadiusKm) {
    donors = await User.find({
      role: "donor",
      bloodGroup: { $in: groups },
      isAvailable: true,
      isVerified: true,
      location: {
        $near: {
          $geometry: request.location,
          $maxDistance: radius * 1000, // km -> meters
        },
      },
    }).limit(30);

    // Filter by donation eligibility (90-day rule) in application layer
    donors = donors.filter((d) => d.isEligibleToDonate());

    if (donors.length >= 5 || radius >= maxRadiusKm) break;
    radius += 10; // expand radius automatically
  }

  return { donors, finalRadiusKm: radius };
};

export const createRequest = async (req, res, next) => {
  try {
    const {
      patientName,
      bloodGroup,
      unitsRequired,
      hospitalName,
      doctorName,
      urgency,
      city,
      lat,
      lng,
      contactPhone,
      notes,
    } = req.body;

    if (!patientName || !bloodGroup || !unitsRequired || !hospitalName || !city || !contactPhone) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const request = await BloodRequest.create({
      requester: req.user._id,
      patientName,
      bloodGroup,
      unitsRequired,
      hospitalName,
      doctorName,
      urgency: urgency || "normal",
      city,
      contactPhone,
      notes,
      location: lat && lng ? { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] } : undefined,
      statusTimeline: [{ status: "open", note: "Request created" }],
    });

    const { donors, finalRadiusKm } = await findMatchingDonors(request);

    request.matchedDonors = donors.map((d) => ({ donor: d._id }));
    request.status = donors.length ? "matching" : "open";
    request.searchRadiusKm = finalRadiusKm;
    request.statusTimeline.push({
      status: request.status,
      note: `${donors.length} donor(s) matched within ${finalRadiusKm}km`,
    });
    await request.save();

    res.status(201).json({
      success: true,
      request,
      matchedDonorsCount: donors.length,
      donors: donors.map((d) => ({ id: d._id, name: d.name, bloodGroup: d.bloodGroup, city: d.city })),
    });
  } catch (err) {
    next(err);
  }
};

export const getRequests = async (req, res, next) => {
  try {
    const { status, bloodGroup, city, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (city) filter.city = new RegExp(city, "i");

    // Patients/hospitals see only their own requests; admins see all
    if (!["admin"].includes(req.user.role)) {
      filter.requester = req.user._id;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [requests, total] = await Promise.all([
      BloodRequest.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("matchedDonors.donor", "name bloodGroup city phone"),
      BloodRequest.countDocuments(filter),
    ]);

    res.json({
      success: true,
      requests,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

export const getRequestById = async (req, res, next) => {
  try {
    const request = await BloodRequest.findById(req.params.id).populate(
      "matchedDonors.donor",
      "name bloodGroup city phone"
    );
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });
    res.json({ success: true, request });
  } catch (err) {
    next(err);
  }
};

// Donor accepts or rejects a specific request
export const respondToRequest = async (req, res, next) => {
  try {
    const { action } = req.body; // "accept" | "reject"
    const request = await BloodRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    const match = request.matchedDonors.find((m) => m.donor.toString() === req.user._id.toString());
    if (!match) return res.status(403).json({ success: false, message: "You are not matched to this request" });

    match.status = action === "accept" ? "accepted" : "rejected";
    request.statusTimeline.push({
      status: `donor_${match.status}`,
      note: `${req.user.name} ${match.status} the request`,
    });

    if (action === "accept") {
      request.status = "matching";
    }

    await request.save();
    res.json({ success: true, request });
  } catch (err) {
    next(err);
  }
};

export const cancelRequest = async (req, res, next) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });
    if (request.requester.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    request.status = "cancelled";
    request.statusTimeline.push({ status: "cancelled", note: "Cancelled by requester" });
    await request.save();
    res.json({ success: true, request });
  } catch (err) {
    next(err);
  }
};

// Mark a request fulfilled + credit donor with reward points & donation history
export const fulfillRequest = async (req, res, next) => {
  try {
    const { donorId } = req.body;
    const request = await BloodRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    request.status = "fulfilled";
    request.statusTimeline.push({ status: "fulfilled", note: "Donation completed" });
    await request.save();

    if (donorId) {
      await User.findByIdAndUpdate(donorId, {
        $inc: { rewardPoints: 50, totalDonations: 1 },
        lastDonationDate: new Date(),
      });
    }

    res.json({ success: true, request });
  } catch (err) {
    next(err);
  }
};
