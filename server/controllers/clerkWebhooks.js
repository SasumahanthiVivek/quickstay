import { Webhook } from "svix";
import User from "../models/User.js";

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "crazyfunboys576@gmai.com")
  .trim()
  .toLowerCase();

const getDisplayName = (data, email) => {
  const firstName = (data.first_name || "").trim();
  const lastName = (data.last_name || "").trim();
  const fullName = `${firstName} ${lastName}`.trim();

  if (fullName) return fullName;

  const username = (data.username || "").trim();
  if (username) return username;

  if (email && email.includes("@")) {
    return email.split("@")[0];
  }

  return "User";
};

// API Controller Function to Manage Clerk User with database
// POST /api/clerk
const clerkWebhooks = async (req, res) => {
  try {
    // Create a Svix instance with clerk webhook secret.
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Getting Headers
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Verifying Headers
    await whook.verify(JSON.stringify(req.body), headers);

    // Getting Data from request body
    const { data, type } = req.body;

    const email = (data.email_addresses[0].email_address || "")
      .trim()
      .toLowerCase();

    const userData = {
      _id: data.id,
      email,
      username: getDisplayName(data, email),
      image: data.image_url,
      role: email === ADMIN_EMAIL ? "owner" : "user",
    };

    // Switch Cases for differernt Events
    switch (type) {
      case "user.created": {
        await User.create(userData);
        break;
      }

      case "user.updated": {
        await User.findByIdAndUpdate(data.id, userData);
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        break;
      }

      default:
        break;
    }

    res.json({ success: true, message: "Webhook Recieved" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;