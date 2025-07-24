import { z } from "zod";
import { differenceInMinutes, isAfter } from "date-fns";

// Schema for POST /api/bookings
const createBookingSchema = z.object({
  body: z
    .object({
      resource: z
        .string({ required_error: "Resource is required" })
        .min(1, "Resource is required"),
      requestedBy: z
        .string({ required_error: "Requested by is required" })
        .min(1, "Requested by is required"),
      startTime: z
        .string({ required_error: "Start time is required" })
        .refine((val) => !isNaN(Date.parse(val)), "Invalid start time format"),
      endTime: z
        .string({ required_error: "End time is required" })
        .refine((val) => !isNaN(Date.parse(val)), "Invalid end time format"),
    })
    .refine(
      (data) => isAfter(new Date(data.endTime), new Date(data.startTime)),
      {
        message: "End time must be after start time",
        path: ["endTime"],
      }
    )
    .refine(
      (data) => {
        const duration = differenceInMinutes(
          new Date(data.endTime),
          new Date(data.startTime)
        );
        return duration >= 15 && duration <= 120;
      },
      {
        message: "Booking duration must be between 15 minutes and 2 hours",
        path: ["endTime"],
      }
    ),
});

// Schema for GET /api/bookings
const getBookingsQuerySchema = z.object({
  query: z.object({
    resource: z.string().optional(),
    date: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val || (/^\d{4}-\d{2}-\d{2}$/.test(val) && !isNaN(Date.parse(val))),
        "Date must be in YYYY-MM-DD format and valid"
      ),
  }),
});

// Schema for DELETE /api/bookings/:id
const cancelBookingSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: "Booking ID is required" })
      .refine((val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) > 0, {
        message: "Booking ID must be a positive integer",
      }),
  }),
});

// Schema for GET /api/available-slots
const getAvailableSlotsQuerySchema = z.object({
  query: z.object({
    resource: z
      .string({ required_error: "Resource is required" })
      .min(1, "Resource is required"),
    date: z
      .string({ required_error: "Date is required" })
      .refine(
        (val) => /^\d{4}-\d{2}-\d{2}$/.test(val) && !isNaN(Date.parse(val)),
        "Date must be in YYYY-MM-DD format and valid"
      ),
    duration: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val ||
          (!isNaN(parseInt(val, 10)) &&
            parseInt(val, 10) >= 15 &&
            parseInt(val, 10) <= 120),
        "Duration must be a number between 15 and 120 minutes"
      ),
  }),
});

export const bookingValidations = {
  createBookingSchema,
  getBookingsQuerySchema,
  cancelBookingSchema,
  getAvailableSlotsQuerySchema,
};
