// Helper to compute booking status
function computeStatus(booking: {
  startTime: Date;
  endTime: Date;
}): "Upcoming" | "Ongoing" | "Past" {
  const now = new Date();
  if (now < booking.startTime) return "Upcoming";
  if (now >= booking.startTime && now <= booking.endTime) return "Ongoing";
  return "Past";
}

export default computeStatus;
