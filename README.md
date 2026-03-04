# Gym Training Tracker

A full-stack application for tracking gym training sessions with a React frontend and Node.js/Express backend.

## Project Structure

- `client/` - React + TypeScript frontend (Vite)
- `server/` - Node.js + Express backend
- `.github/` - GitHub configuration and workflow files
- `.vscode/` - VS Code tasks for development

## Prerequisites

- Node.js 18+ and npm (Already installed on your system: v24.14.0)

## Getting Started

### Installation

Dependencies are already installed. No additional setup needed!

### Development

Open the VS Code Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and run one of these tasks:

**Option 1: Run Full Stack (Recommended)**
- Command: `Tasks: Run Task` → `Dev: Full Stack (Client + Server)`
- Starts both the Vite dev server (port 5173) and Express backend (port 5000)
- Frontend will automatically proxy API requests to the backend

**Option 2: Run Client Only**
- Command: `Tasks: Run Task` → `Dev: Client Only`
- Frontend dev server only at `http://localhost:5173`

**Option 3: Run Server Only**
- Command: `Tasks: Run Task` → `Dev: Server Only`
- Express server only at `http://localhost:5000`

### Manual Development (Terminal)

If you prefer to use the terminal directly, set the PATH first:

```powershell
$env:PATH = "C:\Program Files\nodejs;$env:PATH"
npm run dev
```

### Build

Run the build task:
- Command: `Tasks: Run Task` → `Build: All Workspaces`

Or from terminal:
```powershell
$env:PATH = "C:\Program Files\nodejs;$env:PATH"
npm run build
```

### Production

Start the server:
```powershell
npm start
```

## Features (Planned)

- Track gym training sessions
- Log exercises and sets
- View training history
- Performance analytics

## Technologies

- **Frontend**: React 18, TypeScript, Vite, Axios
- **Backend**: Node.js, Express, TypeScript
- **Development**: npm workspaces, TypeScript
- **Build Tools**: Vite, TypeScript Compiler

## Project Setup

This project was created with npm workspaces, allowing separate `client/` and `server/` directories that share dependencies while being independently manageable.

### Key Files
- `package.json` - Root workspace configuration
- `client/package.json` - Frontend dependencies
- `server/package.json` - Backend dependencies
- `.vscode/tasks.json` - VS Code development tasks
- `tsconfig.json` - Shared TypeScript base configuration

## API Documentation

### Health Check
- **GET** `/health` - Server status check

### Training Sessions (To be implemented)
- **GET** `/api/sessions` - Get all sessions
- **POST** `/api/sessions` - Create new session
- **GET** `/api/sessions/:id` - Get session by ID
- **PUT** `/api/sessions/:id` - Update session
- **DELETE** `/api/sessions/:id` - Delete session

## Troubleshooting

### npm command not found
If npm isn't recognized in your terminal, run:
```powershell
$env:PATH = "C:\Program Files\nodejs;$env:PATH"
```

This command is automatically included in VS Code tasks.

### Port already in use
- Frontend: Change port in `client/vite.config.ts`
- Backend: Change port in `server/src/index.ts`

## License

MIT
