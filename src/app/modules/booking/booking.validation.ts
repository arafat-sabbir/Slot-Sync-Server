import { z } from "zod";

const createBookingSchema = z.object({
  body: z.object({
    resource: z
      .string({ required_error: "Resource is required" })
      .min(1, "Resource is required"),
    requestedBy: z
      .string({ required_error: "Requested by is required" })
      .min(1, "Requested by is required"),
    startTime: z
      .string({ required_error: "Start time is required" })
      .refine((val) => !isNaN(Date.parse(val)), "Invalid start time"),
    endTime: z
      .string({ required_error: "End time is required" })
      .refine((val) => !isNaN(Date.parse(val)), "Invalid end time"),
  }),
});

const getBookingsQuerySchema = z.object({
  query: z.object({
    resource: z.string().optional(),
    date: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val),
        "Date must be in YYYY-MM-DD format"
      ),
  }),
});

export const bookingValidations = {
  createBookingSchema,
  getBookingsQuerySchema,
};
