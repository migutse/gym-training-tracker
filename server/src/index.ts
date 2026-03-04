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
// The build step (npm run build at the workspace root) already builds the
// client into that directory. When the server is started from the root
// workspace (`npm start`), __dirname will point to server/dist, so we go up
// two directories to reach the project root.
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.resolve(__dirname, '../../client/dist')
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
