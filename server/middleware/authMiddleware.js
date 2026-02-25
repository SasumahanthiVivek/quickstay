export const protect = async (req, res, next) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    next(); // ✅ DO NOT BLOCK USER HERE
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Auth failed",
    });
  }
};
