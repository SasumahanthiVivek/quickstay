import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { assets, facilityIcons } from "../assets/assets";
import StarRating from "../components/StarRating";
import { useAppContext } from "../context/useAppContext";

const CheckBox = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onChange(e.target.checked, label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const RadioButton = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="radio"
        name="sortOption"
        checked={selected}
        onChange={() => onChange(label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const Hotels = () => {
  const [searchParams] = useSearchParams();
  const destination = searchParams.get("destination") || "";

  const { axios, navigate } = useAppContext();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFilters, setOpenFilters] = useState(false);

  const roomTypes = ["Single Bed", "Double Bed", "Luxury Room", "Family Suite"];
  const priceRanges = ["0 to 500", "500 to 1000", "1000 to 2000", "2000 to 3000"];
  const sortOptions = ["Price Low to High", "Price High to Low", "Newest First"];
  const localImageSet = [assets.roomImg1, assets.roomImg2, assets.roomImg3, assets.roomImg4];

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const query = destination ? `?destination=${encodeURIComponent(destination)}` : "";
      const res = await axios.get(`/api/rooms${query}`);
      const apiRooms = res.data?.rooms || [];

      if (apiRooms.length === 0) {
        setRooms([]);
        return;
      }

      const uniqueHotelRooms = [];
      const seenHotelIds = new Set();
      for (const room of apiRooms) {
        const hotelId = room?.hotel?._id;
        if (!room?._id || !hotelId || seenHotelIds.has(hotelId)) continue;
        seenHotelIds.add(hotelId);
        uniqueHotelRooms.push(room);
      }

      const baseRooms = uniqueHotelRooms.length > 0 ? uniqueHotelRooms : apiRooms;
      const filledRooms = [...baseRooms];

      let fallbackIndex = 0;
      while (filledRooms.length < 4) {
        filledRooms.push(baseRooms[fallbackIndex % baseRooms.length]);
        fallbackIndex += 1;
      }

      setRooms(filledRooms.slice(0, 4));
    } catch (error) {
      console.error("Fetch rooms error:", error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, [axios, destination]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const sortedRooms = useMemo(() => {
    return [...rooms].sort((a, b) => {
      if (a.createdAt < b.createdAt) return 1;
      if (a.createdAt > b.createdAt) return -1;
      return 0;
    });
  }, [rooms]);

  const displayRooms = useMemo(() => sortedRooms.slice(0, 4), [sortedRooms]);

  if (loading) {
    return (
      <div className="px-6 md:px-16 lg:px-24 py-28 md:py-32 text-center">
        <p>Loading rooms...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse lg:flex-row items-start justify-between pt-24 md:pt-35 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 gap-8">
      <div className="w-full">
        <div className="flex flex-col items-start text-left">
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-[40px]">Hotel Rooms</h1>
          <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-3xl">
            Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.
          </p>
        </div>

        {displayRooms.length === 0 ? (
          <div className="py-10 text-gray-500">No rooms found for this destination.</div>
        ) : (
          displayRooms.map((room, index) => (
            <div
              key={`${room._id || "room"}-${index}`}
              className="flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-20 last:border-0"
            >
              <img
                onClick={() => {
                  navigate(`/rooms/${room._id}`);
                  scrollTo(0, 0);
                }}
                src={localImageSet[index % 4]}
                alt="room"
                title="View Room Details"
                className="w-full md:w-1/2 h-56 sm:h-72 md:h-64 rounded-xl shadow-lg object-cover cursor-pointer"
              />

                <div className="w-full md:w-1/2 flex flex-col gap-2">
                <p className="text-gray-500">{room.hotel?.city || "City"}</p>
                <p
                  onClick={() => {
                    navigate(`/rooms/${room._id}`);
                    scrollTo(0, 0);
                  }}
                  className="text-gray-800 text-2xl sm:text-3xl font-playfair cursor-pointer"
                >
                  {room.hotel?.name || room.roomType}
                </p>
                <div className="flex items-center">
                  <StarRating />
                  <p className="ml-2">200+ reviews</p>
                </div>

                <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm">
                  <img src={assets.locationIcon} alt="location-icon" />
                  <span>{room.hotel?.address || "Address unavailable"}</span>
                </div>

                <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
                  {(room.amenities || []).map((item, amenityIndex) => (
                    <div
                      key={amenityIndex}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70"
                    >
                      {facilityIcons[item] && (
                        <img src={facilityIcons[item]} alt={item} className="w-5 h-5" />
                      )}
                      <p className="text-xs">{item}</p>
                    </div>
                  ))}
                </div>

                <p className="text-xl font-medium text-gray-700">${room.pricePerNight} /night</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-white w-full lg:w-80 border border-gray-300 text-gray-600 max-lg:mb-2 min-lg:mt-16">
        <div
          className={`flex items-center justify-between px-5 py-2.5 min-lg:border-b border-gray-300 ${
            openFilters && "border-b"
          }`}
        >
          <p className="text-base font-medium text-gray-800">FILTERS</p>
          <div className="text-xs cursor-pointer">
            <span onClick={() => setOpenFilters(!openFilters)} className="lg:hidden">
              {openFilters ? "HIDE" : "SHOW"}
            </span>
            <span className="hidden lg:block">CLEAR</span>
          </div>
        </div>

        <div
          className={`${
            openFilters ? "h-auto" : "h-0 lg:h-auto"
          } overflow-hidden transition-all duration-700`}
        >
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Popular filters</p>
            {roomTypes.map((roomType, index) => (
              <CheckBox key={index} label={roomType} />
            ))}
          </div>
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Price Range</p>
            {priceRanges.map((range, index) => (
              <CheckBox key={index} label={`$ ${range}`} />
            ))}
          </div>
          <div className="px-5 pt-5 pb-7">
            <p className="font-medium text-gray-800 pb-2">Sort By</p>
            {sortOptions.map((option, index) => (
              <RadioButton key={index} label={option} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hotels;
