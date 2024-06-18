import { $connect, $disconnect } from "./services/prisma.service"

import Express from "express"
import UsersRoute from "./routes/users.routes"
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

process.on("SIGINT", async () => {
  await $disconnect()
  process.exit(0)
})

const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => console.log(`Server running at PORT ${PORT}`))
