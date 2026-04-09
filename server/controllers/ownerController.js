 // ownerController.js
import imagekit from "../configs/imagiKit.js";
import Booking from "../Models/Booking.js";
import Car from "../Models/Car.js";
import User from "../Models/User.js";
import fs from "fs";

// Change user role to owner
export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { role: "owner" });
    res.json({ success: true, message: "Role changed to owner" });
  } catch (error) {
    console.error("changeRoleToOwner Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a new car
export const addCar = async (req, res) => {
  try {
    // 1️⃣ Auth check
    if (!req.user?._id) return res.status(401).json({ success: false, message: "Unauthorized" });

    // 2️⃣ Validate carData
    if (!req.body.carData) return res.status(400).json({ success: false, message: "Car data missing" });
    let car;
    try { car = JSON.parse(req.body.carData); } 
    catch { return res.status(400).json({ success: false, message: "Invalid carData JSON" }); }

    // 3️⃣ Validate image
    if (!req.file) return res.status(400).json({ success: false, message: "No image uploaded" });

    // 4️⃣ Map frontend keys to backend schema
    const carObj = {
      owner: req.user._id,
      brand: car.brand,
      model: car.model,
      year: Number(car.year),
      category: car.category,
      seating_capacity: Number(car.seating_Capacity),
      fuel_type: car.fuelType,
      transmission: car.transmission,
      pricePerDay: Number(car.pricePerDay),
      location: car.location,
      description: car.description,
    };

    // 5️⃣ Upload image to ImageKit
    const fileBuffer = fs.readFileSync(req.file.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: req.file.originalname,
      folder: "/cars",
    });

    carObj.image = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "1280" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    // 6️⃣ Save car in DB
    await Car.create(carObj);

    res.json({ success: true, message: "Car added successfully" });
  } catch (error) {
    console.error("AddCar Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// List all cars for owner
export const getOwnerCars = async (req, res) => {
  try {
    const { _id } = req.user;
    const cars = await Car.find({ owner: _id });
    res.json({ success: true, cars });
  } catch (error) {
    console.error("getOwnerCars Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle car availability
export const toggleCarAvailability = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;
    const car = await Car.findById(carId);

    if (!car) return res.status(404).json({ success: false, message: "Car not found" });
    if (car.owner.toString() !== _id.toString())
      return res.status(403).json({ success: false, message: "Unauthorized" });

    car.isAvailable = !car.isAvailable;
    await car.save();

    res.json({ success: true, message: "Car availability toggled" });
  } catch (error) {
    console.error("toggleCarAvailability Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a car
export const deleteCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;
    const car = await Car.findById(carId);

    if (!car) return res.status(404).json({ success: false, message: "Car not found" });
    if (car.owner.toString() !== _id.toString())
      return res.status(403).json({ success: false, message: "Unauthorized" });

    // Soft delete
    car.owner = null;
    car.isAvailable = false;
    await car.save();

    res.json({ success: true, message: "Car deleted successfully" });
  } catch (error) {
    console.error("deleteCar Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Dashboard stats
export const getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;
    if (role !== "owner") return res.status(403).json({ success: false, message: "Unauthorized" });

    const cars = await Car.find({ owner: _id });
    const bookings = (await Booking.find({ owner: _id }).populate("car"))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const pendingBookings = bookings.filter(b => b.status === "pending");
    const completedBookings = bookings.filter(b => b.status === "confirmed");

    const monthlyRevenue = completedBookings.reduce((acc, b) => acc + b.price, 0);

    const dashboardData = {
      totalCars: cars.length,
      totalBookings: bookings.length,
      pendingBookings: pendingBookings.length,
      completedBookings: completedBookings.length,
      recentBookings: bookings.slice(0, 3),
      monthlyRevenue,
    };

    res.json({ success: true, dashboardData });
  } catch (error) {
    console.error("getDashboardData Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user profile image
export const updateUserImage = async (req, res) => {
  try {
    const { _id } = req.user;
    if (!req.file) return res.status(400).json({ success: false, message: "No image uploaded" });

    const fileBuffer = fs.readFileSync(req.file.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: req.file.originalname,
      folder: "/users",
    });

    const optimizedImageURL = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "400" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    await User.findByIdAndUpdate(_id, { image: optimizedImageURL });

    res.json({ success: true, message: "Image updated successfully" });
  } catch (error) {
    console.error("updateUserImage Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};