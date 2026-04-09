 // bookingController.js
import Booking from "../Models/Booking.js";
import Car from "../Models/Car.js";

// ================================
// Helper: Check if a car is available
// ================================
const checkCarAvailability = async (carId, pickupDate, returnDate, userId = null) => {
  const query = {
    car: carId,
    pickupDate: { $lte: returnDate },
    returnDate: { $gte: pickupDate },
  };

  // Exclude bookings by the same user (so user can rebook same car if dates allow)
  if (userId) {
    query.user = { $ne: userId };
  }

  const booking = await Booking.findOne(query);
  return !booking; // true if no overlapping booking
};

// ================================
// API: Check available cars for a location & date range
// ================================
export const checkCarAvailabilityOfCar = async (req, res) => {
  try {
    const { location, pickupDate, returnDate } = req.body;

    if (!location || !pickupDate || !returnDate) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const cars = await Car.find({ location, isAvailable: true });

    const availableCarsPromises = cars.map(async (car) => {
      const isAvailable = await checkCarAvailability(car._id, pickupDate, returnDate, req.user?._id);
      return { ...car._doc, isAvailable };
    });

    let availableCars = await Promise.all(availableCarsPromises);
    availableCars = availableCars.filter((car) => car.isAvailable);

    res.json({ success: true, availableCars });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================================
// API: Create a new booking
// ================================
export const createBooking = async (req, res) => {
  try {
    const { _id } = req.user; // user making the booking
    const { car, pickupDate, returnDate } = req.body;

    if (!car || !pickupDate || !returnDate) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    // Check availability excluding user's own bookings
    const isAvailable = await checkCarAvailability(car, pickupDate, returnDate, _id);
    if (!isAvailable) {
      return res.status(400).json({ success: false, message: "Car is not available for selected dates" });
    }

    const carData = await Car.findById(car);
    if (!carData) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);
    const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24)) || 1;
    const price = carData.pricePerDay * noOfDays;

    await Booking.create({ car, owner: carData.owner, user: _id, pickupDate, returnDate, price });

    res.json({ success: true, message: "Booking Created" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================================
// API: Get bookings of a user
// ================================
export const getUserBookings = async (req, res) => {
  try {
    const { _id } = req.user;
    const bookings = await Booking.find({ user: _id }).populate("car").sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================================
// API: Get bookings of an owner
// ================================
export const getOwnerBookings = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const bookings = await Booking.find({ owner: req.user._id })
      .populate("car user", "-password")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================================
// API: Change booking status
// ================================
export const changeBookingStatus = async (req, res) => {
  try {
    const { _id } = req.user;
    const { bookingId, status } = req.body;

    if (!bookingId || !status) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.owner.toString() !== _id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    booking.status = status;
    await booking.save();

    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};