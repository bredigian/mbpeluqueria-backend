-- AlterTable
ALTER TABLE "Notice" ADD CONSTRAINT "Notice_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Weekday" ADD CONSTRAINT "Weekday_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Workhour" ADD CONSTRAINT "Workhour_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "WorkhoursByWeekday" ADD CONSTRAINT "WorkhoursByWeekday_pkey" PRIMARY KEY ("id");
