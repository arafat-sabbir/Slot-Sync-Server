import { Router } from "express";
import { BookingRoutes } from "../modules/booking/booking.route";

const router = Router();

const routes = [
  {
    path: "/bookings",
    router: BookingRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.router));

const allRoutes = router;

export default allRoutes;
