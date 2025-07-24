import catchAsync from "../../utils/catchAsync";
import { bookingServices } from "./booking.service";
import sendResponse from "../../utils/sendResponse";
import {
  AvailableSlotsQueryParams,
  BookingQueryParams,
  BookingRequestBody,
} from "./booking.interface";

// Create a new booking (POST /api/bookings)
const bookSlot = catchAsync(async (req, res) => {
  const body: BookingRequestBody = req.body;
  const result = await bookingServices.addNewBooking(body);
  sendResponse(res, {
    statusCode: 201,
    message: "Booking created successfully",
    data: result,
  });
});

// Get all bookings with optional filters (GET /api/bookings)
const getBookings = catchAsync(async (req, res) => {
  const query: BookingQueryParams = {
    resource: req.query.resource as string | undefined,
    date: req.query.date as Date | undefined,
    status: req.query.status as string | undefined,
  };
  const bookings = await bookingServices.getBookings(query);
  sendResponse(res, {
    statusCode: 200,
    message: "Bookings retrieved successfully",
    data: bookings,
  });
});

// Cancel a booking (DELETE /api/bookings/:id)
const cancelBooking = catchAsync(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id || isNaN(id)) {
    throw new Error("Invalid booking ID");
  }
  const result = await bookingServices.cancelBooking(id);
  sendResponse(res, {
    statusCode: 200,
    message: "Booking canceled successfully",
    data: result,
  });
});

// Get available slots for a resource on a date (GET /api/available-slots)
const getAvailableSlots = catchAsync(async (req, res) => {
  const query: AvailableSlotsQueryParams = {
    resource: req.query.resource as string | undefined,
    date: req.query.date as string | undefined,
    duration: req.query.duration as string | undefined,
  };
  if (!query.resource || !query.date) {
    throw new Error("Resource and date are required");
  }
  const duration = query.duration ? parseInt(query.duration, 10) : 15;
  if (isNaN(duration)) {
    throw new Error("Invalid duration");
  }
  const slots = await bookingServices.getAvailableSlots(
    query.resource,
    query.date,
    duration
  );
  sendResponse(res, {
    statusCode: 200,
    message: "Available slots retrieved successfully",
    data: slots,
  });
});

export const bookingControllers = {
  bookSlot,
  getBookings,
  cancelBooking,
  getAvailableSlots,
};
