// Type for booking data
interface BookingData {
  resource: string;
  startTime: string;
  endTime: string;
  requestedBy: string;
}

// Type for booking response (includes computed status)
interface BookingResponse {
  id: number;
  resource: string;
  startTime: Date;
  endTime: Date;
  requestedBy: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  status?: "Upcoming" | "Ongoing" | "Past";
}

// Request body type for POST /api/bookings
interface BookingRequestBody {
  resource: string;
  startTime: string;
  endTime: string;
  requestedBy: string;
}

// Query params type for GET /api/bookings
interface BookingQueryParams {
  resource?: string;
  date?: string;
}

// Query params type for GET /api/available-slots
interface AvailableSlotsQueryParams {
  resource?: string;
  date?: string;
  duration?: string; // Duration in minutes (string in query, parsed to number)
}

export {
  BookingData,
  BookingResponse,
  BookingRequestBody,
  BookingQueryParams,
  AvailableSlotsQueryParams,
};
