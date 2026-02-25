import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/useAppContext";

const AllRooms = () => {
  const [searchParams] = useSearchParams();
  const destination = searchParams.get("destination");

  const { axios, currency } = useAppContext();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = useCallback(async () => {
    try {
      const res = await axios.get(
        `/api/rooms?destination=${destination}`
      );
      setRooms(res.data.rooms || []);
    } catch (error) {
      console.error("Fetch rooms error:", error);
    } finally {
      setLoading(false);
    }
  }, [axios, destination]);

  useEffect(() => {
    if (destination) {
      fetchRooms();
    } else {
      setLoading(false);
    }
  }, [destination, fetchRooms]);

  if (loading) {
    return <p className="text-center mt-10">Loading rooms...</p>;
  }

  return (
    <div className="px-6 md:px-16 lg:px-24 py-10">
      <h2 className="text-2xl font-bold mb-6">
        Rooms in {destination || "All Locations"}
      </h2>

      {rooms.length === 0 ? (
        <p>No rooms found</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="border rounded-lg p-4 cursor-pointer"
            >
              <img
                src={room.images?.[0]}
                alt={room.name}
                className="h-48 w-full object-cover rounded"
              />
              <h3 className="font-semibold mt-2">{room.name}</h3>
              <p className="text-sm text-gray-500">{room.city}</p>
              <p className="font-bold mt-1">{currency}{room.price}/night</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllRooms;
