import { PrismaClient } from "@prisma/client";
import {
  addMinutes,
  subMinutes,
  differenceInMinutes,
  startOfDay,
  endOfDay,
  isAfter,
} from "date-fns";
import AppError from "../../errors/appError";
import { BookingData, BookingResponse } from "./booking.interface";
import computeStatus from "../../utils/compute-status";

const prisma = new PrismaClient();

// Add a new booking
export const addNewBooking = async (
  bookingData: BookingData
): Promise<BookingResponse> => {
  const { resource, startTime, endTime, requestedBy } = bookingData;

  const start = new Date(startTime);
  const end = new Date(endTime);

  // Validation
  if (isAfter(start, end)) {
    throw new AppError(400, "Start time must be before end time");
  }
  const duration = differenceInMinutes(end, start);
  if (duration < 15) {
    throw new AppError(400, "Minimum duration is 15 minutes");
  }
  if (duration > 120) {
    throw new AppError(400, "Maximum duration is 2 hours");
  }

  // Check for conflicts with buffer
  const bookings = await prisma.booking.findMany({
    where: { resource, isActive: true },
  });

  const hasConflict = bookings.some((booking) => {
    const existingStart = subMinutes(new Date(booking.startTime), 10);
    const existingEnd = addMinutes(new Date(booking.endTime), 10);
    return start < existingEnd && end > existingStart;
  });

  if (hasConflict) {
    throw new AppError(
      409,
      "Booking conflicts with existing booking or buffer time"
    );
  }

  // Create booking
  const newBooking = await prisma.booking.create({
    data: { resource, startTime: start, endTime: end, requestedBy },
  });

  return { ...newBooking, status: computeStatus(newBooking) };
};

// Get bookings with optional filters

export const getBookings = async (filters: {
  resource?: string;
  date?: Date;
  status?: string;
}): Promise<BookingResponse[]> => {
  const where: any = { isActive: true };

  // Filter by resource
  if (filters.resource && filters.resource !== "all") {
    where.resource = filters.resource;
  }

  // Filter by date
  if (filters.date) {
    const dayStart = startOfDay(filters.date);
    const dayEnd = endOfDay(filters.date);
    where.AND = [
      { startTime: { gte: dayStart } },
      { startTime: { lte: dayEnd } },
    ];
  }

  // Get all bookings matching resource/date filters
  const bookings = await prisma.booking.findMany({
    where,
    orderBy: { startTime: "asc" },
  });

  // Compute status for each booking
  const bookingsWithStatus = bookings.map((booking) => ({
    ...booking,
    status: computeStatus(booking),
  }));

  // Filter by status if specified
  if (filters.status && filters.status !== "all") {
    return bookingsWithStatus.filter(
      (booking) =>
        booking.status.toLowerCase() === filters.status?.toLowerCase()
    );
  }

  return bookingsWithStatus;
};

// Cancel a booking
export const cancelBooking = async (id: number): Promise<BookingResponse> => {
  const booking = await prisma.booking.findUnique({
    where: { id, isActive: true },
  });
  if (!booking) {
    throw new AppError(404, "Booking not found");
  }

  const updatedBooking = await prisma.booking.delete({
    where: { id },
  });

  return { ...updatedBooking, status: computeStatus(updatedBooking) };
};

// Get available slots for a resource on a date
export const getAvailableSlots = async (
  resource: string,
  date: string,
  duration: number = 15
): Promise<{ startTime: string; endTime: string }[]> => {
  if (!resource || !date) {
    throw new AppError(400, "Resource and date are required");
  }
  if (duration < 15 || duration > 120) {
    throw new AppError(400, "Duration must be between 15 and 120 minutes");
  }

  const dayStart = startOfDay(new Date(date));
  const dayEnd = endOfDay(new Date(date));

  // Get active bookings for the resource on the date
  const bookings = await prisma.booking.findMany({
    where: {
      resource,
      isActive: true,
      AND: [{ startTime: { gte: dayStart } }, { startTime: { lte: dayEnd } }],
    },
  });

  // Create buffered ranges
  const blockedRanges = bookings.map((booking) => ({
    start: subMinutes(new Date(booking.startTime), 10),
    end: addMinutes(new Date(booking.endTime), 10),
  }));

  // Generate available slots in 30-minute increments
  const slots: { startTime: string; endTime: string }[] = [];
  let current = dayStart;
  while (current < dayEnd) {
    const slotEnd = addMinutes(current, duration);
    if (slotEnd > dayEnd) break;

    const hasConflict = blockedRanges.some(
      (range) => current < range.end && slotEnd > range.start
    );

    if (!hasConflict) {
      slots.push({
        startTime: current.toISOString(),
        endTime: slotEnd.toISOString(),
      });
    }

    current = addMinutes(current, 30); // Move to next 30-minute slot
  }

  return slots;
};

export const bookingServices = {
  addNewBooking,
  getBookings,
  getAvailableSlots,
  cancelBooking,
};
