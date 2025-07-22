// routes/booking.ts
import { Router } from "express";
import { bookingControllers } from "./booking.controller";

const router = Router();

router.post("/", bookingControllers.bookSlot);
router.get("/", bookingControllers.getBookings);

export const BookingRoutes = router;
