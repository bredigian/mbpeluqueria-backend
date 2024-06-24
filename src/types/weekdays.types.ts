import { Shift, Weekday } from "@prisma/client"

export interface IWeekdayWithAssignedShifts extends Weekday {
  assignedWorkhours: Shift[]
}
