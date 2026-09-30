import 'dotenv/config'
import app from './app'
import { connectDatabase } from './config/database'
import { env } from './config/env'

async function startServer() {
  await connectDatabase()
  app.listen(env.PORT, () => console.info(`TechTrack API escuchando en http://localhost:${env.PORT}`))
}

startServer().catch((error: unknown) => {
  console.error('No fue posible iniciar TechTrack API.', error)
  process.exitCode = 1
})