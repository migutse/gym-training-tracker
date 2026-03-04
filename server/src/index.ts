import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// In production we'll serve the React front-end from the client/dist folder.
if (process.env.NODE_ENV === 'production') {
  // In production, __dirname resolves to /app/server/dist (or similar)
  // We need to go up 2 directories: /app/server/dist -> /app/server -> /app
  // Then into client/dist
  const clientDistPath = path.join(process.cwd(), '..', 'client', 'dist')
  app.use(express.static(clientDistPath))

  // Send index.html for any unknown route so React Router (if used) can handle it
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(clientDistPath, 'index.html'))
  })
}

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
