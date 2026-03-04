import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'Server is running' })
})

app.get('/api/sessions', (req: Request, res: Response) => {
  res.json({ message: 'Get all sessions' })
})

app.post('/api/sessions', (req: Request, res: Response) => {
  res.json({ message: 'Create new session' })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
