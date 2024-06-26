-- CreateEnum
CREATE TYPE "ERole" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "ERole" NOT NULL
);

-- CreateTable
CREATE TABLE "Shift" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Weekday" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "number" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Workhour" (
    "id" TEXT NOT NULL,
    "hours" INTEGER NOT NULL,
    "minutes" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "WorkhoursByWeekday" (
    "id" TEXT NOT NULL,
    "weekday_id" TEXT NOT NULL,
    "workhour_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Shift_id_key" ON "Shift"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Weekday_id_key" ON "Weekday"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Workhour_id_key" ON "Workhour"("id");

-- CreateIndex
CREATE UNIQUE INDEX "WorkhoursByWeekday_id_key" ON "WorkhoursByWeekday"("id");

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkhoursByWeekday" ADD CONSTRAINT "WorkhoursByWeekday_weekday_id_fkey" FOREIGN KEY ("weekday_id") REFERENCES "Weekday"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkhoursByWeekday" ADD CONSTRAINT "WorkhoursByWeekday_workhour_id_fkey" FOREIGN KEY ("workhour_id") REFERENCES "Workhour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
