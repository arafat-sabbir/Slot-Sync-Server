// routes/booking.ts
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { addMinutes, subMinutes, isAfter } from "date-fns";

const router = Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  try {
    const { resource, startTime, endTime, requestedBy } = req.body;

    if (!resource || !startTime || !endTime || !requestedBy) {
      return res.status(400).json({ message: "All fields required" });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    // Validation
    if (isAfter(start, end))
      return res.status(400).json({ message: "End must be after start" });
    if (end.getTime() - start.getTime() < 15 * 60 * 1000) {
      return res
        .status(400)
        .json({ message: "Minimum duration is 15 minutes" });
    }

    const bookings = await prisma.booking.findMany({
      where: { resource },
    });

    // Check for conflict with buffer
    const hasConflict = bookings.some((booking) => {
      const existingStart = subMinutes(new Date(booking.startTime), 10);
      const existingEnd = addMinutes(new Date(booking.endTime), 10);
      return start < existingEnd && end > existingStart;
    });

    if (hasConflict)
      return res
        .status(409)
        .json({ message: "Booking conflicts with existing one" });

    // Create booking
    const newBooking = await prisma.booking.create({
      data: { resource, startTime: start, endTime: end, requestedBy },
    });

    res.status(201).json(newBooking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { resource, date } = req.query;

    const filters: any = {};
    if (resource) filters.resource = resource.toString();
    if (date) {
      const start = new Date(date.toString());
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);
      filters.startTime = {
        gte: start,
        lte: end,
      };
    }

    const bookings = await prisma.booking.findMany({
      where: filters,
      orderBy: { startTime: "asc" },
    });

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export const BookingRoutes = router;
