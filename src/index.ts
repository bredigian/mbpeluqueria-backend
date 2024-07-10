import { $connect, $disconnect } from "./services/prisma.service"

import AuthRoute from "./routes/auth.routes"
import { DateTime } from "luxon"
import Express from "express"
import NoticesRoute from "./routes/notices.routes"
import NotificationsRoute from "./routes/notifications.routes"
// Routes
import ShiftsRoute from "./routes/shifts.routes"
import UsersRoute from "./routes/users.routes"
import WeekdaysRoute from "./routes/weekdays.routes"
import WorkhoursByWeekdayRoute from "./routes/workhours-by-weekday.routes"
import WorkhoursRoute from "./routes/workhours.routes"
//-----------------------------
import { config } from "dotenv"
import cors from "cors"

config()

const app = Express()

app.use(cors())
app.use(Express.json())

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

process.on("SIGINT", async () => {
  await $disconnect()
  process.exit(0)
})

const PORT = process.env.PORT ?? 3000
app.listen(PORT, () =>
  console.log(`Server running at PORT ${PORT} at ${DateTime.now().toHTTP()}`)
)

export default app
