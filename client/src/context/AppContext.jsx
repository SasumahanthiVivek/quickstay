import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AppContext } from "./useAppContext";
import { assets, facilityIcons } from "../assets/assets";

const AppContextProvider = ({ children }) => {
  const adminEmail = (
    import.meta.env.VITE_ADMIN_EMAIL || "crazyfunboys576@gmail.com"
  )
    .trim()
    .toLowerCase();

  const navigate = useNavigate();
  const { isSignedIn, getToken } = useAuth();
  const { user: clerkUser } = useUser();

  const [user, setUser] = useState(null);
  const [currentEmail, setCurrentEmail] = useState("");
  const [role, setRole] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [searchedCities, setSearchedCities] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const currency = "$";

  const axiosInstance = useMemo(
    () =>
      axios.create({
        baseURL: "http://localhost:3000",
      }),
    []
  );

  // ✅ Fetch user
  const fetchUser = useCallback(async () => {
    try {
      setLoadingUser(true);
      const token = await getToken();
      if (!token) return;

      const res = await axiosInstance.get("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (res.data.success) {
        const mergedUser = res.data.user || clerkUser;
        setUser(mergedUser);

        const currentEmail = (
          res.data.user?.email ||
          clerkUser?.primaryEmailAddress?.emailAddress ||
          clerkUser?.emailAddresses?.[0]?.emailAddress ||
          ""
        )
          .trim()
          .toLowerCase();

        setCurrentEmail(currentEmail);

        const currentIsAdmin = currentEmail === adminEmail;
        setIsAdmin(currentIsAdmin);

        const dashboardRole = currentIsAdmin ? "owner" : "user";
        setRole(dashboardRole);
        setIsOwner(dashboardRole === "owner");
        setSearchedCities(res.data.recentSearchedCities || []);
      }
    } catch (error) {
      console.error("fetchUser error:", error);
    } finally {
      setLoadingUser(false);
    }
  }, [adminEmail, axiosInstance, clerkUser, getToken]);

  const fetchRooms = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/api/rooms");
      if (data.success) {
        const apiRooms = data.rooms || [];
        if (apiRooms.length > 0) {
          const localImageSet = [assets.roomImg1, assets.roomImg2, assets.roomImg3, assets.roomImg4];
          const normalizedRooms = apiRooms.map((room, index) => ({
            ...room,
            images: [
              localImageSet[index % 4],
              localImageSet[(index + 1) % 4],
              localImageSet[(index + 2) % 4],
              localImageSet[(index + 3) % 4],
            ],
          }));
          setRooms(normalizedRooms);
        } else {
          setRooms([]);
        }
      }
    } catch (error) {
      console.error("fetchRooms error:", error);
      setRooms([]);
    }
  }, [axiosInstance]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    if (isSignedIn) fetchUser();
    else {
      setUser(null);
      setCurrentEmail("");
      setRole(null);
      setIsOwner(false);
      setIsAdmin(false);
      setSearchedCities([]);
      setLoadingUser(false);
    }
  }, [fetchUser, isSignedIn]);

  const value = {
    // 🔹 used in Hero.jsx
    navigate,
    axios: axiosInstance,
    getToken,
    searchedCities,
    setSearchedCities,
    isOwner,
    setIsOwner,
    isAdmin,
    rooms,
    facilityIcons,
    currency,
    toast,
    setRole,

    // 🔹 used elsewhere
    user,
    role,
    currentEmail,
    loadingUser,
    isSignedIn,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
