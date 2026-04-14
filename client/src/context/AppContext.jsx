 import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // ✅ NEW
  const [showLogin, setShowLogin] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cars, setCars] = useState([]);

  // ✅ fetch user
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/data");

      if (data.success) {
        setUser(data.user);
        setIsOwner(data.user.role === "owner");
      } else {
        setUser(null);
        setIsOwner(false);
      }
    } catch (error) {
      setUser(null);
      setIsOwner(false);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setAuthLoading(false); // ✅ IMPORTANT
    }
  };

  // fetch cars
  const fetchCars = async () => {
  try {
    const { data } = await axios.get("/api/cars"); // ✅ FIXED
    if (data.success) {
      setCars(data.cars);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || error.message);
  }
};

  // logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsOwner(false);
    axios.defaults.headers.common["Authorization"] = "";
    toast.success("You have been logged out");
  };

  // get token
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
    } else {
      setAuthLoading(false); // ✅ no token → stop loading
      setIsOwner(false);
    }
  }, []);

  // run APIs AFTER token
  useEffect(() => {
  fetchCars(); // ✅ always fetch cars
}, []);

useEffect(() => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    fetchUser();
  }
}, [token]);

  const value = {
    navigate,
    currency,
    axios,
    user,
    token,
    isOwner,
    authLoading, // ✅ export
    setToken,
    setUser,
    setIsOwner,
    fetchUser,
    showLogin,
    setShowLogin,
    logout,
    fetchCars,
    cars,
    setCars,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);