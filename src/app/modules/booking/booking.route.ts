import { Router } from "express";
import { bookingControllers } from "./booking.controller";
import validateRequest from "../../middlewares/validateRequest";
import { bookingValidations } from "./booking.validation";

const router = Router();

/**
 * @description Book a new time slot for a resource
 * @param {string} path - '/api/bookings'
 * @param {function} validator - ['createBookingSchema']
 * @param {function} controller - ['bookSlot']
 * @returns {object} - router
 * @access public
 * @method POST
 */
router.post(
  "/",
  validateRequest(bookingValidations.createBookingSchema),
  bookingControllers.bookSlot
);

/**
 * @description Get all bookings with optional resource and date filters
 * @param {string} path - '/api/bookings'
 * @param {function} validator - ['getBookingsQuerySchema']
 * @param {function} controller - ['getBookings']
 * @returns {object} - router
 * @access public
 * @method GET
 */
router.get(
  "/",
  validateRequest(bookingValidations.getBookingsQuerySchema),
  bookingControllers.getBookings
);

/**
 * @description Cancel a booking by ID
 * @param {string} path - '/api/bookings/:id'
 * @param {function} validator - ['cancelBookingSchema']
 * @param {function} controller - ['cancelBooking']
 * @returns {object} - router
 * @access public
 * @method DELETE
 */
router.delete(
  "/:id",
  validateRequest(bookingValidations.cancelBookingSchema),
  bookingControllers.cancelBooking
);

/**
 * @description Get available time slots for a resource on a specific date
 * @param {string} path - '/api/available-slots'
 * @param {function} validator - ['getAvailableSlotsQuerySchema']
 * @param {function} controller - ['getAvailableSlots']
 * @returns {object} - router
 * @access public
 * @method GET
 */
router.get(
  "/available-slots",
  validateRequest(bookingValidations.getAvailableSlotsQuerySchema),
  bookingControllers.getAvailableSlots
);

export const BookingRoutes = router;
