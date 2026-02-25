import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/useAppContext";
import toast from "react-hot-toast";
import { assets } from "../assets/assets";

const MapIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-4 h-4 fill-yellow-400" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const getNextDateString = (dateString) => {
  if (!dateString) return "";
  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
};

const HotelDetail = () => {
  const { id } = useParams();
  const { axios, navigate, currency } = useAppContext();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [isAvailable, setIsAvailable] = useState(false);
  const [hasCheckedAvailability, setHasCheckedAvailability] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const onChangeCheckInDate = (value) => {
    setCheckInDate(value);
    setHasCheckedAvailability(false);
    setIsAvailable(false);

    const minCheckoutDate = getNextDateString(value);
    if (checkOutDate && minCheckoutDate && checkOutDate < minCheckoutDate) {
      setCheckOutDate("");
    }
  };

  const onChangeCheckOutDate = (value) => {
    if (!checkInDate) {
      toast.error("Please select Check-In date first");
      setCheckOutDate("");
      return;
    }

    const minCheckoutDate = getNextDateString(checkInDate);
    if (value && minCheckoutDate && value < minCheckoutDate) {
      toast.error("Check-Out date must be after Check-In date");
      setCheckOutDate("");
      return;
    }

    setCheckOutDate(value);
    setHasCheckedAvailability(false);
    setIsAvailable(false);
  };

  const fetchHotelDetails = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/hotels/${id}`);
      if (res.data.success) {
        setHotel(res.data.hotel);
        // Fetch rooms for this hotel
        const roomRes = await axios.get(`/api/rooms?hotel=${id}`);
        if (roomRes.data.success) {
          setRooms(roomRes.data.rooms || []);
        }
      } else {
        toast.error("Failed to load hotel details");
        navigate("/hotels");
      }
    } catch (error) {
      console.error("Fetch hotel error:", error);
      toast.error("Error loading hotel");
      navigate("/hotels");
    } finally {
      setLoading(false);
    }
  }, [id, axios, navigate]);

  useEffect(() => {
    fetchHotelDetails();
  }, [fetchHotelDetails]);

  const checkAvailability = async (roomId) => {
    try {
      if (!checkInDate) {
        toast.error("Please select Check-In date first");
        return;
      }

      if (!checkOutDate) {
        toast.error("Please select Check-Out date");
        return;
      }

      if (checkInDate >= checkOutDate) {
        toast.error("Check-In date must be before Check-Out date");
        return;
      }

      setCheckingAvailability(true);
      setHasCheckedAvailability(false);
      const res = await axios.post("/api/bookings/check-availability", {
        room: roomId,
        checkInDate,
        checkOutDate,
      });

      if (res.data.success) {
        setHasCheckedAvailability(true);
        if (res.data.isAvailable) {
          setIsAvailable(true);
          toast.success("Room is available!");
        } else {
          setIsAvailable(false);
          toast.error("Room is not available for these dates");
        }
      } else {
        setIsAvailable(false);
        toast.error(res.data.message || "Failed to check availability");
      }
    } catch (error) {
      console.error("Availability check error:", error);
      setIsAvailable(false);
      if (error?.code === "ERR_NETWORK") {
        toast.error("Unable to connect to server. Please make sure backend is running.");
      } else {
        toast.error(error?.response?.data?.message || "Failed to check availability");
      }
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleBookRoom = async (roomId) => {
    try {
      if (bookingInProgress || showBookingSuccess) return;
      if (!isAvailable) {
        toast.error("Please check availability first");
        return;
      }

      const token = localStorage.getItem("clerkToken");
      if (!token) {
        toast.error("Please log in to book a room");
        navigate("/");
        return;
      }

      setBookingInProgress(true);
      const res = await axios.post(
        "/api/bookings/book",
        {
          room: roomId,
          checkInDate,
          checkOutDate,
          guests: parseInt(guests),
          paymentMethod: "Pay At Hotel",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setShowBookingSuccess(true);
      } else {
        toast.error(res.data.message || "Booking failed");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.response?.data?.message || "Failed to book room");
    } finally {
      setBookingInProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 md:px-16 lg:px-24 py-20 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="px-4 sm:px-6 md:px-16 lg:px-24 py-20 text-center">
        <p className="text-xl text-gray-600">Hotel not found</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-16 lg:px-24 py-24 md:py-32">
      {showBookingSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-green-600">Booking Confirmed</p>
              <button
                onClick={() => setShowBookingSuccess(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-gray-900">Congratulations! Your stay is booked.</h2>
            <p className="mt-2 text-gray-600">Your reservation is secured. Review payment status and details in your bookings.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => {
                  setShowBookingSuccess(false);
                  navigate("/my-bookings");
                  scrollTo(0, 0);
                }}
                className="w-full rounded-lg bg-primary py-2.5 text-white font-semibold hover:bg-primary-dull"
              >
                View My Bookings
              </button>
              <button
                onClick={() => setShowBookingSuccess(false)}
                className="w-full rounded-lg border border-gray-300 py-2.5 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Back Button */}
      <button
        onClick={() => navigate("/hotels")}
        className="mb-6 flex items-center gap-2 text-primary hover:underline cursor-pointer"
      >
        <span>←</span> Back to Hotels
      </button>

      {/* Hotel Header */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold mb-6 break-words">
          {hotel.name}
        </h1>

        {/* Hotel Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Address */}
          <div className="flex gap-4 items-start">
            <MapIcon />
            <div>
              <p className="font-semibold text-gray-800">Address</p>
              <p className="text-gray-600">{hotel.address}</p>
            </div>
          </div>

          {/* City */}
          <div className="flex gap-4 items-start">
            <LocationIcon />
            <div>
              <p className="font-semibold text-gray-800">City</p>
              <p className="text-gray-600">{hotel.city}</p>
            </div>
          </div>

          {/* Contact */}
          <div className="flex gap-4 items-start">
            <PhoneIcon />
            <div>
              <p className="font-semibold text-gray-800">Contact</p>
              <p className="text-gray-600">{hotel.contact}</p>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} />
            ))}
          </div>
          <span className="text-gap-600 ml-2">4.8 (127 reviews)</span>
        </div>
      </div>

      {/* Booking Widget */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6 mb-10 md:col-span-2">
        <h2 className="text-2xl font-bold mb-6">Select Your Dates</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Check-In */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Check-In
            </label>
            <input
              type="date"
              value={checkInDate}
                onChange={(e) => onChangeCheckInDate(e.target.value)}
                min={today}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>

          {/* Check-Out */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Check-Out
            </label>
            <input
              type="date"
              value={checkOutDate}
                onFocus={() => {
                  if (!checkInDate) {
                    toast.error("Please select Check-In date first");
                  }
                }}
                onChange={(e) => onChangeCheckOutDate(e.target.value)}
                min={getNextDateString(checkInDate) || ""}
                disabled={!checkInDate}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>

          {/* Guests */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Guests
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>

          {/* Search Button */}
          <button
            onClick={() => selectedRoom && checkAvailability(selectedRoom._id)}
            disabled={!selectedRoom || checkingAvailability}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all cursor-pointer sm:col-span-2 lg:col-span-1 ${
              !selectedRoom || checkingAvailability
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-primary-dull active:scale-95"
            }`}
          >
            {checkingAvailability ? "Checking..." : "Check Availability"}
          </button>
        </div>

        {/* Availability Status */}
        {hasCheckedAvailability && (
          isAvailable ? (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <span className="text-xl">✓</span>
              <span className="text-green-700 font-medium">
                Great! This room is available for your dates.
              </span>
            </div>
          ) : (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <span className="text-xl">⚠</span>
              <span className="text-red-700 font-medium">
                Room is not available for your selected dates.
              </span>
            </div>
          )
        )}
      </div>

      {/* Rooms Section */}
      <div>
        <h2 className="text-3xl font-bold mb-8">Available Rooms</h2>

        {rooms.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg">
              No rooms available at this hotel yet
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {rooms.map((room, idx) => (
              <div
                key={room._id}
                onClick={() => {
                  setSelectedRoom(room);
                  setHasCheckedAvailability(false);
                  setIsAvailable(false);
                }}
                className={`border-2 rounded-xl overflow-hidden transition-all cursor-pointer ${
                  selectedRoom?._id === room._id
                    ? "border-primary shadow-lg"
                    : "border-gray-200 hover:border-primary/50"
                }`}
              >
                {/* Room Image - Using Real Images from Assets */}
                <div className="h-40 bg-gray-200 flex items-center justify-center relative overflow-hidden">
                  <img
                    src={[
                      assets.roomImg1,
                      assets.roomImg2,
                      assets.roomImg3,
                      assets.roomImg4,
                    ][idx % 4]}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                  {selectedRoom?._id === room._id && (
                    <div className="absolute top-2 right-2 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Selected
                    </div>
                  )}
                </div>

                {/* Room Info */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {room.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {room.roomType}
                  </p>

                  {/* Amenities */}
                  {room.amenities && room.amenities.length > 0 && (
                    <div className="mb-4 pb-4 border-b">
                      <p className="text-xs font-semibold text-gray-700 mb-2">
                        Amenities:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {room.amenities.slice(0, 3).map((amenity, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price */}
                  <div className="mb-4 pb-4 border-b">
                    <p className="text-2xl font-bold text-primary">
                      {currency}{room.pricePerNight}
                    </p>
                    <p className="text-xs text-gray-600">per night</p>
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={() => {
                      if (selectedRoom?._id === room._id && isAvailable) {
                        handleBookRoom(room._id);
                      } else if (selectedRoom?._id === room._id) {
                        toast.error("Please check availability first");
                      } else {
                        setSelectedRoom(room);
                      }
                    }}
                    disabled={selectedRoom?._id !== room._id || !isAvailable || bookingInProgress || showBookingSuccess}
                    className={`w-full py-2.5 rounded-lg font-semibold transition-all cursor-pointer ${
                      selectedRoom?._id === room._id && isAvailable && !bookingInProgress && !showBookingSuccess
                        ? "bg-primary text-white hover:bg-primary-dull active:scale-95"
                        : "bg-gray-200 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    {bookingInProgress ? "Booking..." : (selectedRoom?._id === room._id && isAvailable
                      ? "Book Now"
                      : "Select Room")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelDetail;
