-- CreateTable
CREATE TABLE "Booking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "requestedBy" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'Upcoming',
    "bufferBefore" INTEGER NOT NULL DEFAULT 10,
    "bufferAfter" INTEGER NOT NULL DEFAULT 10
);

-- CreateIndex
CREATE INDEX "Booking_resource_startTime_endTime_idx" ON "Booking"("resource", "startTime", "endTime");
