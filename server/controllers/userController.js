import User from "../models/User.js";

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "crazyfunboys576@gmail.com")
  .trim()
  .toLowerCase();

const deriveDisplayName = (sessionClaims, email) => {
  const sessionName = (sessionClaims?.name || "").trim();
  if (sessionName) return sessionName;

  if (email && email.includes("@")) {
    return email.split("@")[0];
  }

  return "User";
};

// ✅ GET USER DATA
export const getUserData = async (req, res) => {
  try {
    const auth = req.auth?.();

    // Not logged in
    if (!auth || !auth.userId) {
      return res.status(200).json({
        success: true,
        user: null,
        role: "user",
        recentSearchedCities: [],
      });
    }

    const { userId, sessionClaims } = auth;

    let user = await User.findById(userId);

    const claimEmail = (sessionClaims?.email || "").trim().toLowerCase();

    // Auto-create user
    if (!user) {
      user = await User.create({
        _id: userId,
        username: deriveDisplayName(sessionClaims, claimEmail),
        email: claimEmail,
        image: sessionClaims?.picture || "",
        role: "user",
        recentSearchedCities: [],
      });
    }

    if (!user.email && claimEmail) {
      user.email = claimEmail;
    }

    if (!user.username || user.username.trim() === "" || user.username.includes("undefined")) {
      user.username = deriveDisplayName(sessionClaims, user.email);
    }

    const email = (user.email || "").trim().toLowerCase();
    const role = email === ADMIN_EMAIL ? "owner" : user.role;

    if (role !== user.role) {
      user.role = role;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        image: user.image,
      },
      role,
      recentSearchedCities: user.recentSearchedCities,
    });
  } catch (error) {
    console.error("getUserData error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};

// ✅ STORE RECENT SEARCHED CITIES
export const storeRecentSearchedCities = async (req, res) => {
  try {
    const auth = req.auth?.();
    if (!auth || !auth.userId) {
      return res.status(401).json({ success: false });
    }

    const { recentSearchedCity } = req.body;
    if (!recentSearchedCity) {
      return res.status(400).json({ success: false });
    }

    const user = await User.findById(auth.userId);
    if (!user) {
      return res.status(404).json({ success: false });
    }

    user.recentSearchedCities = [
      ...new Set([
        recentSearchedCity,
        ...user.recentSearchedCities,
      ]),
    ].slice(0, 3);

    await user.save();

    res.json({
      success: true,
      recentSearchedCities: user.recentSearchedCities,
    });
  } catch (error) {
    console.error("storeRecentSearchedCities error:", error);
    res.status(500).json({ success: false });
  }
};
