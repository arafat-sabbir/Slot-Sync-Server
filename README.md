Slot-Sync Backend
The Slot-Sync backend is the server for the Slot-Sync application, a slot management system built with Express.js, Prisma, and SQLite. It powers resource booking, retrieval, cancellation, and availability checks with robust validation and TypeScript support. Explore the repository at arafat-sabbir/Slot-Sync-Server or test the live API at https://slot-sync-server.vercel.app/.
Table of Contents

Features
Setup
Running the Backend
API Endpoints
Technologies
Contributing

Features

Book a Slot: Create bookings with validation for time conflicts and duration (15–120 minutes).
View Bookings: Retrieve bookings with optional resource and date filters.
Cancel Bookings: Soft-cancel bookings by setting isActive: false and updating updatedAt.
Check Availability: Get available time slots for a resource on a specific date.
Data Validation: Strict input validation using Zod for all API endpoints.
Database: SQLite with Prisma ORM for efficient data management and migrations.

Setup

Clone the Repository:
git clone https://github.com/arafat-sabbir/Slot-Sync-Server.git
cd Slot-Sync-Server


Install Dependencies:
npm install

Required packages: express, @prisma/client, zod, date-fns, @types/express (dev).

Set Up Environment:Create a .env file in the root directory:
DATABASE_URL="file:./data/safe-slot.db"
PORT=5000
NODE_ENV="development"


Run Prisma Migrations:
npx prisma migrate dev

This applies the schema (prisma/schema.prisma) and creates safe-slot.db.

Generate Prisma Client:
npx prisma generate



Running the Backend

Start the server:npm run dev


The server runs on http://localhost:5000.

API Endpoints

POST /api/bookings

Creates a new booking.
Body: { resource: string, requestedBy: string, startTime: string, endTime: string }
Example: { "resource": "Room A", "requestedBy": "John Doe", "startTime": "2025-07-24T10:00:00Z", "endTime": "2025-07-24T11:00:00Z" }


GET /api/bookings?resource=&date=

Retrieves bookings with optional filters.
Example: http://localhost:5000/api/bookings?resource=Room A&date=2025-07-24


DELETE /api/bookings/:id

Cancels a booking by ID.
Example: http://localhost:5000/api/bookings/1


GET /api/available-slots?resource=&date=&duration=

Retrieves available time slots.
Example: http://localhost:5000/api/available-slots?resource=Room A&date=2025-07-24&duration=30



Technologies

Express.js: API server
Prisma: ORM with SQLite
Zod: Input validation
date-fns: Date utilities
TypeScript: Type safety

Contributing

Fork the repository.
Create a feature branch (git checkout -b feature/YourFeature).
Commit changes (git commit -m "Add YourFeature").
Push to the branch (git push origin feature/YourFeature).
Open a pull request on GitHub.

For bugs or feature requests, please open an issue.