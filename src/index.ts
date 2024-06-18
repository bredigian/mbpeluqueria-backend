import { $connect, $disconnect } from "./services/prisma.service"

import Express from "express"
// Routes
import ShiftsRoute from "./routes/shifts.routes"
import UsersRoute from "./routes/users.routes"
import WeekdaysRoute from "./routes/weekdays.routes"
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
  res.json({ message: "Express.js + TypeScript Backend" })
})

app.use("/users", UsersRoute)
app.use("/shifts", ShiftsRoute)
app.use("/weekdays", WeekdaysRoute)
app.use("/workhours", WorkhoursRoute)

process.on("SIGINT", async () => {
  await $disconnect()
  process.exit(0)
})

const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => console.log(`Server running at PORT ${PORT}`))
