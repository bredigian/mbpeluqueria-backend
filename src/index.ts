import { $connect, $disconnect } from "./services/prisma.service"

import AuthRoute from "./routes/auth.routes"
import Express from "express"
import NoticesRoute from "./routes/notices.routes"
import NotificationsRoute from "./routes/notifications.routes"
import { Server } from "socket.io"
import { Shift } from "@prisma/client"
// Routes
import ShiftsRoute from "./routes/shifts.routes"
import UsersRoute from "./routes/users.routes"
import WeekdaysRoute from "./routes/weekdays.routes"
import WorkhoursByWeekdayRoute from "./routes/workhours-by-weekday.routes"
import WorkhoursRoute from "./routes/workhours.routes"
//-----------------------------
import { config } from "dotenv"
import cors from "cors"
import { createServer } from "node:http"

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
app.use("/workhours-by-weekday", WorkhoursByWeekdayRoute)
app.use("/notices", NoticesRoute)
app.use("/notifications", NotificationsRoute)
app.use("/auth", AuthRoute)

process.on("SIGINT", async () => {
  await $disconnect()
  process.exit(0)
})

const socketServer = createServer(app)
const io = new Server(socketServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

io.on("connection", (socket) => {
  console.log(`${socket.handshake.query.user} is connected.`)

  socket.on("reserve-shift", async (data: Shift) =>
    socket.broadcast.emit("reserve-shift", data)
  )

  socket.on("cancel-shift", async (data: Shift) =>
    socket.broadcast.emit("cancel-shift", data)
  )

  socket.on("disconnect", () =>
    console.log(`${socket.handshake.query.user} is disconnected.`)
  )
})

const PORT = process.env.PORT ?? 3000
socketServer.listen(PORT, () => console.log(`Server running at PORT ${PORT}`))

export default app
