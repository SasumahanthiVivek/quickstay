import Hotel from "../models/Hotel.js";
import User from "../models/User.js";
import { ensureDemoData } from "../utils/seedDemoData.js";

// ✅ GET ALL HOTELS (PUBLIC)
export const getAllHotels = async (req, res) => {
  try {
    await ensureDemoData();
    const hotels = await Hotel.find({ owner: { $regex: /^demo_owner_/ } }).sort({ createdAt: -1 });
    res.json({ success: true, hotels });
  } catch (error) {
    console.error("getAllHotels error:", error);
    res.status(500).json({ success: false });
  }
};

// ✅ GET SINGLE HOTEL (PUBLIC)
export const getHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);
    
    if (!hotel) {
      return res.status(404).json({ success: false, message: "Hotel not found" });
    }
    
    res.json({ success: true, hotel });
  } catch (error) {
    console.error("getHotel error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch hotel" });
  }
};

// ✅ CREATE HOTEL (OWNER)
export const createHotel = async (req, res) => {
  try {
    const { name, city, address, contact } = req.body;
    const { userId } = req.auth;

    if (!name || !city || !address || !contact) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const existingHotel = await Hotel.findOne({ owner: userId });
    if (existingHotel) {
      return res.status(400).json({
        success: false,
        message: "Hotel already exists for this owner",
      });
    }

    const hotel = await Hotel.create({
      name,
      city,
      address,
      contact,
      owner: userId,
    });

    await User.findByIdAndUpdate(userId, { role: "owner" });

    res.json({ success: true, message: "Hotel registered successfully", hotel });
  } catch (error) {
    console.error("createHotel error:", error);
    res.status(500).json({ success: false });
  }
};
