-- CreateEnum
CREATE TYPE "Weekday" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');

-- AlterTable
ALTER TABLE "restaurants" ADD COLUMN     "resourceId" TEXT;

-- CreateTable
CREATE TABLE "booking_resources" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Paris',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_availability_rules" (
    "id" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "dayOfWeek" "Weekday" NOT NULL,
    "opensAt" TEXT NOT NULL,
    "closesAt" TEXT NOT NULL,

    CONSTRAINT "booking_availability_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_special_closures" (
    "id" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "reason" TEXT,

    CONSTRAINT "booking_special_closures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_settings" (
    "id" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "slotIntervalMinutes" INTEGER NOT NULL DEFAULT 15,
    "averageDurationMinutes" INTEGER NOT NULL DEFAULT 90,
    "bufferMinutes" INTEGER NOT NULL DEFAULT 15,
    "maxPartySize" INTEGER NOT NULL DEFAULT 12,
    "maxConcurrentReservations" INTEGER NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_reservations" (
    "id" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "partySize" INTEGER NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerEmail" TEXT,
    "comment" TEXT,
    "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_reservations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "booking_availability_rules_resourceId_dayOfWeek_idx" ON "booking_availability_rules"("resourceId", "dayOfWeek");

-- CreateIndex
CREATE INDEX "booking_special_closures_resourceId_date_idx" ON "booking_special_closures"("resourceId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "booking_settings_resourceId_key" ON "booking_settings"("resourceId");

-- CreateIndex
CREATE INDEX "booking_reservations_resourceId_date_idx" ON "booking_reservations"("resourceId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "restaurants_resourceId_key" ON "restaurants"("resourceId");

-- AddForeignKey
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "booking_resources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_availability_rules" ADD CONSTRAINT "booking_availability_rules_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "booking_resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_special_closures" ADD CONSTRAINT "booking_special_closures_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "booking_resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_settings" ADD CONSTRAINT "booking_settings_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "booking_resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_reservations" ADD CONSTRAINT "booking_reservations_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "booking_resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

