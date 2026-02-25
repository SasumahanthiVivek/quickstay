import transporter from "../configs/nodemailer.js";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
import stripe from "stripe";

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "crazyfunboys576@gmail.com")
  .trim()
  .toLowerCase();
const CHECK_IN_HOUR = Number(process.env.CHECK_IN_HOUR || 12);
const PAYMENT_DEADLINE_HOURS = 3;

const toDateOnly = (dateInput) => {
  const parsed = new Date(dateInput);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
};

const getCheckInDateTime = (dateInput) => {
  const dateOnly = toDateOnly(dateInput);
  if (!dateOnly) return null;
  dateOnly.setHours(CHECK_IN_HOUR, 0, 0, 0);
  return dateOnly;
};

const getPaymentDeadline = (checkInDate) => {
  const checkInDateTime = getCheckInDateTime(checkInDate);
  if (!checkInDateTime) return null;
  return new Date(checkInDateTime.getTime() - PAYMENT_DEADLINE_HOURS * 60 * 60 * 1000);
};

const isPendingPaymentExpired = (booking, referenceTime = new Date()) => {
  if (!booking || booking.isPaid) return false;
  const deadline = getPaymentDeadline(booking.checkInDate);
  if (!deadline) return false;
  return referenceTime >= deadline;
};

const getExpiryDateBoundary = (referenceTime = new Date()) => {
  const boundary = new Date(referenceTime);
  boundary.setHours(CHECK_IN_HOUR - PAYMENT_DEADLINE_HOURS, 0, 0, 0);

  const compareDate = new Date(referenceTime);
  compareDate.setHours(0, 0, 0, 0);

  if (referenceTime < boundary) {
    compareDate.setDate(compareDate.getDate() - 1);
  }

  return compareDate;
};

const expireUnpaidBookings = async (extraFilter = {}) => {
  const expiryDateBoundary = getExpiryDateBoundary();

  await Booking.updateMany(
    {
      ...extraFilter,
      isPaid: false,
      status: { $nin: ["cancelled", "expired"] },
      checkInDate: { $lte: expiryDateBoundary },
    },
    {
      $set: {
        status: "expired",
      },
    }
  );
};

// Function to Check Availablity of Room
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {

  try {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
      return false;
    }

    if (checkIn >= checkOut) {
      return false;
    }

    await expireUnpaidBookings({ room });

    const bookings = await Booking.find({
      room,
      status: { $nin: ["cancelled", "expired"] },
      checkInDate: { $lt: checkOut },
      checkOutDate: { $gt: checkIn },
    });

    const isAvailable = bookings.length === 0;
    return isAvailable;

  } catch (error) {
    console.error(error.message);
  }
};

// API to check availability of room
// POST /api/bookings/check-availability
export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;

    if (!room || !checkInDate || !checkOutDate) {
      return res.json({ success: false, message: "Room and dates are required" });
    }

    const roomData = await Room.findById(room);
    if (!roomData) {
      return res.json({ success: false, message: "Room not found" });
    }

    const checkIn = toDateOnly(checkInDate);
    const checkOut = toDateOnly(checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!checkIn || !checkOut) {
      return res.json({ success: false, message: "Invalid booking dates" });
    }

    if (checkIn < today) {
      return res.json({ success: false, message: "Check-in date cannot be in the past" });
    }

    if (checkOut <= checkIn) {
      return res.json({ success: false, message: "Check-out date must be after check-in date" });
    }

    const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });

    res.json({ success: true, isAvailable });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to create a new booking
// POST /api/bookings/book
export const createBooking = async (req, res) => {
  try {

    const { room, checkInDate, checkOutDate, guests } = req.body;
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const currentUserEmail = (user.email || "").trim().toLowerCase();
    if (currentUserEmail && currentUserEmail === ADMIN_EMAIL) {
      return res.status(403).json({
        success: false,
        message: "Admin account cannot create bookings.",
      });
    }

    if (!room || !checkInDate || !checkOutDate) {
      return res.json({ success: false, message: "Room and booking dates are required" });
    }

    const guestsCount = Number(guests);
    if (!Number.isInteger(guestsCount) || guestsCount < 1) {
      return res.json({ success: false, message: "Guests must be at least 1" });
    }

    const checkIn = toDateOnly(checkInDate);
    const checkOut = toDateOnly(checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!checkIn || !checkOut) {
      return res.json({ success: false, message: "Invalid booking dates" });
    }

    if (checkIn < today) {
      return res.json({ success: false, message: "Check-in date cannot be in the past" });
    }

    if (checkOut <= checkIn) {
      return res.json({ success: false, message: "Check-out date must be after check-in date" });
    }

    // Before Booking Check Availability
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room,
    });

    if (!isAvailable) {
      return res.json({ success: false, message: "Room is not available" });
    }

    // Get totalPrice from Room
    const roomData = await Room.findById(room).populate("hotel");
    let totalPrice = roomData.pricePerNight;

    // Calculate totalPrice based on nights
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    totalPrice *= nights;

    const booking = await Booking.create({
      user: userId,
      room,
      hotel: roomData.hotel._id,
      guests: guestsCount,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Hotel Booking Details',
      html: `
        <h2>Your Booking Details</h2>
        <p>Dear ${user.username || "Guest"},</p>
        <p>Thank you for your booking! Here are your details:</p>
        <ul>
          <li><strong>Booking ID:</strong> ${booking.id}</li>
          <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
          <li><strong>Location:</strong> ${roomData.hotel.address}</li>
          <li><strong>Date:</strong> ${booking.checkInDate.toDateString()}</li>
          <li><strong>Booking Amount:</strong>  ${process.env.CURRENCY || '$'} ${booking.totalPrice} /night</li>
        </ul>
        <p>We look forward to welcoming you!</p>
        <p>If you need to make any changes, feel free to contact us.</p>
      `,
    };

    if (user.email) {
      try {
        await transporter.sendMail(mailOptions);
      } catch (mailError) {
        console.error("Booking confirmation email failed:", mailError.message);
      }
    }

    res.json({ success: true, message: "Booking created successfully" });

  } catch (error) {
    console.log(error);
    
    res.json({ success: false, message: "Failed to create booking" });
  }
};

// API to get all bookings for a user
// GET /api/bookings/user
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const currentUser = await User.findById(userId).select("email");
    const currentUserEmail = (currentUser?.email || "").trim().toLowerCase();
    if (currentUserEmail && currentUserEmail === ADMIN_EMAIL) {
      return res.status(403).json({
        success: false,
        message: "Admin account cannot access user bookings.",
      });
    }

    await expireUnpaidBookings({ user: userId });

    const bookings = await Booking.find({
      user: userId,
      status: { $nin: ["cancelled"] },
    }).populate("room hotel").sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch bookings" });
  }
};


export const getHotelBookings = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.auth.userId });
    if (!hotel) {
      return res.json({ success: false, message: "No Hotel found" });
    }

    await expireUnpaidBookings({ hotel: hotel._id });

    const bookings = await Booking.find({
      hotel: hotel._id,
      status: { $nin: ["cancelled", "expired"] },
    }).populate("room hotel user").sort({ createdAt: -1 });
    // Total Bookings
    const totalBookings = bookings.length;
    // Total Revenue
    const totalRevenue = bookings.reduce((acc, booking) => (booking.isPaid ? acc + booking.totalPrice : acc), 0);

    res.json({ success: true, dashboardData: { totalBookings, totalRevenue, bookings } });
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch bookings" });
  }
};


export const stripePayment = async (req, res) => {
  try {

    const { bookingId } = req.body;
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const currentUser = await User.findById(userId).select("email");
    const currentUserEmail = (currentUser?.email || "").trim().toLowerCase();
    if (currentUserEmail && currentUserEmail === ADMIN_EMAIL) {
      return res.status(403).json({
        success: false,
        message: "Admin account cannot access booking payments.",
      });
    }

    if (!bookingId) {
      return res.json({ success: false, message: "Booking id is required" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    if (booking.user !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized booking access" });
    }

    if (booking.isPaid) {
      return res.json({ success: true, message: "Booking already paid" });
    }

    if (booking.status === "cancelled" || booking.status === "expired") {
      return res.json({ success: false, message: "This booking is no longer active." });
    }

    if (isPendingPaymentExpired(booking)) {
      booking.status = "expired";
      await booking.save();
      return res.json({
        success: false,
        message:
          "Payment window has expired. Please create a new booking and complete payment at least 3 hours before check-in.",
      });
    }

    const roomData = await Room.findById(booking.room).populate("hotel");
    if (!roomData) {
      return res.json({ success: false, message: "Room not found" });
    }

    const totalPrice = booking.totalPrice;

    const { origin } = req.headers;

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    // Create Line Items for Stripe
    const line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: roomData.hotel.name,
          },
          unit_amount: totalPrice * 100,
        },
        quantity: 1,
      },
    ];

    // Create Checkout Session
    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/my-bookings?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/my-bookings`,
      metadata: {
        bookingId,
      },
    });
    res.json({ success: true, url: session.url });

  } catch (error) {
    res.json({ success: false, message: "Payment Failed" });
  }
}

export const verifyStripePayment = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const userId = req.auth?.userId;

    if (!sessionId) {
      return res.json({ success: false, message: "Session id is required" });
    }

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripeInstance.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return res.json({ success: false, message: "Invalid payment session" });
    }

    const bookingId = session.metadata?.bookingId;
    if (!bookingId) {
      return res.json({ success: false, message: "Booking reference not found" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    if (booking.user !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized booking access" });
    }

    if (session.payment_status === "paid") {
      await Booking.findByIdAndUpdate(bookingId, { isPaid: true, paymentMethod: "Stripe", status: "confirmed" });
      return res.json({ success: true, message: "Payment verified" });
    }

    res.json({ success: false, message: "Payment not completed" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};