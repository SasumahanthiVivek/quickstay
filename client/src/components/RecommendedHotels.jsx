import React, { useCallback, useEffect, useState } from "react";
import { useAppContext } from "../context/useAppContext";
import { useNavigate } from "react-router-dom";

const RecommendedHotels = () => {
  const { axios } = useAppContext();
  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHotels = useCallback(async () => {
    try {
      const res = await axios.get("/api/hotels");
      setHotels(res.data.hotels || []);
    } catch (error) {
      console.error("Recommended hotels error:", error);
    } finally {
      setLoading(false);
    }
  }, [axios]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  if (loading) {
    return null; // or loading skeleton
  }

  if (!Array.isArray(hotels) || hotels.length === 0) {
    return null;
  }

  return (
    <section className="px-6 md:px-16 lg:px-24 mt-16">
      <h2 className="text-2xl font-bold mb-6">Recommended Hotels</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {hotels.slice(0, 4).map((hotel) => (
          <div
            key={hotel._id}
            className="border rounded-lg overflow-hidden cursor-pointer"
            onClick={() => navigate(`/rooms?destination=${hotel.city}`)}
          >
            <img
              src={hotel.image || hotel.images?.[0]}
              alt={hotel.name}
              className="h-48 w-full object-cover"
            />
            <div className="p-3">
              <h3 className="font-semibold">{hotel.name}</h3>
              <p className="text-sm text-gray-500">{hotel.city}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecommendedHotels;
