import { Router } from "express";
import { bookingControllers } from "./booking.controller";
import validateRequest from "../../middlewares/validateRequest";
import { bookingValidations } from "./booking.validation";

const router = Router();

/**
 * @description book a slot
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
 * @description get bookings
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

export const BookingRoutes = router;
