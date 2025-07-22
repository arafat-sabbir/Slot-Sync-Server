import catchAsync from "../../utils/catchAsync";
import { bookingServices } from "./booking.service";
import sendResponse from "../../utils/sendResponse";

const bookSlot = catchAsync(async (req, res) => {
  const result = await bookingServices.addNewBooking(req.body);
  sendResponse(res, {
    statusCode: 201,
    message: "Booking created successfully",
    data: result,
  });
});
const getBookings = catchAsync(async (req, res) => {
  const booking = await bookingServices.getBookings(req.query);
  sendResponse(res, {
    statusCode: 200,
    message: "Bookings retrieved successfully",
    data: booking,
  });
});
export const bookingControllers = {
  bookSlot,
  getBookings,
};
