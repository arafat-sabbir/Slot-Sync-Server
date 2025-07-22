/* eslint-disable @typescript-eslint/no-explicit-any */
import { addMinutes, isAfter, subMinutes } from "date-fns";
import AppError from "../../errors/appError";
import { prisma } from "../../../app";

const addNewBooking = async (bookingData: any) => {
  const { resource, startTime, endTime, requestedBy } = bookingData;

  const start = new Date(startTime);
  const end = new Date(endTime);

  // Validation
  if (isAfter(start, end))
    throw new AppError(400, "Start time must be before end time");
  if (end.getTime() - start.getTime() < 15 * 60 * 1000) {
    throw new AppError(400, "Minimum duration is 15 minutes");
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
    throw new AppError(409, "Booking conflicts with existing one");

  // Create booking
  const newBooking = await prisma.booking.create({
    data: { resource, startTime: start, endTime: end, requestedBy },
  });
  return newBooking;
};

const getBookings = async (query: any) => {
  const { resource, date } = query;

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
  console.log("Filters:", filters);
  const bookings = await prisma.booking.findMany({
    where: filters,
    orderBy: { startTime: "asc" },
  });

  return bookings;
};

export const bookingServices = {
  addNewBooking,
  getBookings,
};
