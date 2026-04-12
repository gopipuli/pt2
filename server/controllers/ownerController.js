 import imagekit from "../configs/imagiKit.js";
import Booking from "../Models/Booking.js";
import Car from "../Models/Car.js";
import User from "../Models/User.js";
import fs from "fs";


// 🔹 Change user role to owner
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


// 🔹 Add a new car
export const addCar = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!req.body.carData) {
      return res.status(400).json({ success: false, message: "Car data missing" });
    }

    let car;
    try {
      car = JSON.parse(req.body.carData);
    } catch {
      return res.status(400).json({ success: false, message: "Invalid JSON" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

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
      isDeleted: false, // ✅ added safety
    };

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

    await Car.create(carObj);

    res.json({ success: true, message: "Car added successfully" });

  } catch (error) {
    console.error("AddCar Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// 🔹 Get owner's cars
export const getOwnerCars = async (req, res) => {
  try {
    const { _id } = req.user;

    const cars = await Car.find({
      owner: _id,
      isDeleted: { $ne: true }, // ✅ prevent deleted cars
    });

    res.json({ success: true, cars });

  } catch (error) {
    console.error("getOwnerCars Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// 🔹 Toggle availability
export const toggleCarAvailability = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;

    const car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    if (car.owner?.toString() !== _id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    car.isAvailable = !car.isAvailable;
    await car.save();

    res.json({ success: true, message: "Availability updated" });

  } catch (error) {
    console.error("toggleCarAvailability Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// 🔹 Delete car (SAFE DELETE)
export const deleteCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;

    const car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    if (car.owner?.toString() !== _id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // ✅ SAFE DELETE (no null errors in bookings)
    car.isDeleted = true;
    car.isAvailable = false;

    await car.save();

    res.json({ success: true, message: "Car deleted safely" });

  } catch (error) {
    console.error("deleteCar Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// 🔹 Dashboard (FULL FIXED - NO ERRORS)
export const getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;

    if (role !== "owner") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // ✅ Cars
    const cars = await Car.find({
      owner: _id,
      isDeleted: { $ne: true },
    });

    // ✅ Bookings with full population
    const bookings = await Booking.find({ owner: _id })
      .populate("car")
      .populate("user")
      .sort({ createdAt: -1 });

    // ✅ Remove all invalid data
    const validBookings = bookings.filter(
      (b) => b && b.car && b.user
    );

    const pendingBookings = validBookings.filter(
      (b) => b.status === "pending"
    );

    const completedBookings = validBookings.filter(
      (b) => b.status === "confirmed"
    );

    const monthlyRevenue = completedBookings.reduce(
      (sum, b) => sum + (b.price || 0),
      0
    );

    const dashboardData = {
      totalCars: cars.length || 0,
      totalBookings: validBookings.length || 0,
      pendingBookings: pendingBookings.length || 0,
      completedBookings: completedBookings.length || 0,
      recentBookings: validBookings.slice(0, 5),
      monthlyRevenue: monthlyRevenue || 0,
    };

    res.json({ success: true, dashboardData });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// 🔹 Update profile image
export const updateUserImage = async (req, res) => {
  try {
    const { _id } = req.user;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    const fileBuffer = fs.readFileSync(req.file.path);

    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: req.file.originalname,
      folder: "/users",
    });

    const imageURL = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "400" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    await User.findByIdAndUpdate(_id, { image: imageURL });

    res.json({ success: true, message: "Image updated successfully" });

  } catch (error) {
    console.error("updateUserImage Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};