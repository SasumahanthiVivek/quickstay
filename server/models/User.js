import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String, // Clerk userId
      required: true,
    },
    username: {
      type: String,
      default: "User",
    },
    email: {
      type: String,
      default: "", // ❗ NOT required
    },
    image: {
      type: String,
      default: "", // ❗ NOT required
    },
    role: {
      type: String,
      enum: ["user", "owner"],
      default: "user",
    },
    recentSearchedCities: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
