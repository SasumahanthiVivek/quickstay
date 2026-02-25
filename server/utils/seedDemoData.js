import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

let seedInProgress = null;
const DEMO_OWNER_PREFIX = "demo_owner_";

const demoHotelsConfig = [
  {
    owner: "demo_owner_1",
    name: "Urbanza Suites",
    city: "New York",
    address: "123 Manhattan Ave, New York, USA",
    contact: "+1-212-555-0147",
  },
  {
    owner: "demo_owner_2",
    name: "Marina Grand",
    city: "Dubai",
    address: "45 Marina Walk, Dubai, UAE",
    contact: "+971-4-555-0190",
  },
  {
    owner: "demo_owner_3",
    name: "Skyline Retreat",
    city: "London",
    address: "78 Oxford Street, London, UK",
    contact: "+44-20-5550-9821",
  },
  {
    owner: "demo_owner_4",
    name: "Bayfront Palace",
    city: "Singapore",
    address: "21 Bayfront Drive, Singapore",
    contact: "+65-6555-3321",
  },
];

const demoImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
];

const createDemoRoomsForHotel = (hotelId, imageOffset = 0) => [
  {
    hotel: hotelId,
    roomType: "Single Bed",
    pricePerNight: 199,
    amenities: ["Free WiFi", "Room Service", "Pool Access"],
    images: [
      demoImages[(imageOffset + 0) % 4],
      demoImages[(imageOffset + 1) % 4],
      demoImages[(imageOffset + 2) % 4],
      demoImages[(imageOffset + 3) % 4],
    ],
    isAvailable: true,
  },
  {
    hotel: hotelId,
    roomType: "Double Bed",
    pricePerNight: 299,
    amenities: ["Free WiFi", "Free Breakfast", "Room Service"],
    images: [
      demoImages[(imageOffset + 1) % 4],
      demoImages[(imageOffset + 2) % 4],
      demoImages[(imageOffset + 3) % 4],
      demoImages[(imageOffset + 0) % 4],
    ],
    isAvailable: true,
  },
  {
    hotel: hotelId,
    roomType: "Luxury Room",
    pricePerNight: 449,
    amenities: ["Free Breakfast", "Room Service", "Mountain View", "Pool Access"],
    images: [
      demoImages[(imageOffset + 2) % 4],
      demoImages[(imageOffset + 3) % 4],
      demoImages[(imageOffset + 0) % 4],
      demoImages[(imageOffset + 1) % 4],
    ],
    isAvailable: true,
  },
];

const seedDemoDataInternal = async () => {
  const existingDemoHotels = await Hotel.find({
    owner: { $regex: `^${DEMO_OWNER_PREFIX}` },
  });

  const hotelByOwner = new Map(existingDemoHotels.map((hotel) => [hotel.owner, hotel]));

  for (const config of demoHotelsConfig) {
    if (!hotelByOwner.has(config.owner)) {
      const createdHotel = await Hotel.create(config);
      hotelByOwner.set(config.owner, createdHotel);
    }
  }

  const orderedDemoHotels = demoHotelsConfig
    .map((config) => hotelByOwner.get(config.owner))
    .filter(Boolean);

  for (let index = 0; index < orderedDemoHotels.length; index += 1) {
    const hotel = orderedDemoHotels[index];
    const roomCount = await Room.countDocuments({ hotel: hotel._id.toString() });

    if (roomCount === 0) {
      const demoRooms = createDemoRoomsForHotel(hotel._id.toString(), index);
      await Room.insertMany(demoRooms);
    }
  }
};

export const ensureDemoData = async () => {
  if (!seedInProgress) {
    seedInProgress = seedDemoDataInternal().finally(() => {
      seedInProgress = null;
    });
  }

  await seedInProgress;
};
