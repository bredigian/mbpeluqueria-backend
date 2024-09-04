import { $connect } from "./services/prisma.service"
import AuthRoute from "./routes/auth.routes"
import { DateTime } from "luxon"
import NoticesRoute from "./routes/notices.routes"
import NotificationsRoute from "./routes/notifications.routes"
import ShiftsRoute from "./routes/shifts.routes"
import type { Express as TExpress } from "express"
import UsersRoute from "./routes/users.routes"
import WeekdaysRoute from "./routes/weekdays.routes"
import WorkhoursByWeekdayRoute from "./routes/workhours-by-weekday.routes"
import WorkhoursRoute from "./routes/workhours.routes"
import { config } from "dotenv"
import cors from "cors"
import express from "express"

config()

export default function App(app: TExpress) {
  app.use(cors())
  app.use(express.json())

  $connect()

  app.get("/", (_, res) => {
    res.json({
      message: "MB Peluquería's API",
      timestamp: DateTime.now().toISO(),
    })
  })

  app.use("/users", UsersRoute)
  app.use("/shifts", ShiftsRoute)
  app.use("/weekdays", WeekdaysRoute)
  app.use("/workhours", WorkhoursRoute)
  app.use("/workhours-by-weekday", WorkhoursByWeekdayRoute)
  app.use("/notices", NoticesRoute)
  app.use("/notifications", NotificationsRoute)
  app.use("/auth", AuthRoute)

  return app
}
