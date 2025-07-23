-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "resource" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "requestedBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Booking" ("createdAt", "endTime", "id", "requestedBy", "resource", "startTime", "updatedAt", "isActive")
SELECT "createdAt", "endTime", "id", "requestedBy", "resource", "startTime", "createdAt" AS "updatedAt", true AS "isActive"
FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
CREATE INDEX "Booking_resource_startTime_endTime_idx" ON "Booking"("resource", "startTime", "endTime");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;