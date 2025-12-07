# Collaborative Coding Interview Platform

A real-time collaborative coding platform built for AI Dev Tools Zoomcamp Homework #2. This application allows multiple users to code together in real-time with support for JavaScript and Python, featuring syntax highlighting and browser-based code execution.

## Features

- **Real-time Collaboration**: Multiple users can edit code simultaneously with WebSocket-based synchronization
- **Shareable Links**: Create and share session links for interview candidates
- **Multi-language Support**: Syntax highlighting for JavaScript and Python via Monaco Editor
- **Code Execution**: Safe browser-based code execution using:
  - **Pyodide** for Python (WebAssembly)
  - Native JavaScript execution with timeout protection
- **Session Management**: Persistent sessions with 24-hour TTL
- **Responsive UI**: Clean, modern interface built with React and Tailwind CSS

## Technology Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Monaco Editor (VSCode's editor component)
- Socket.io-client (WebSocket)
- Pyodide (Python WASM)
- Tailwind CSS (styling)

### Backend
- Node.js + TypeScript
- Express.js (REST API)
- Socket.io (WebSocket server)
- In-memory session storage

### DevOps
- Docker (multi-stage build)
- concurrently (parallel execution)
- Jest (integration testing)

## Prerequisites

- Node.js 20+ and npm
- Docker (for containerized deployment)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd 02-end-to-end
```

### 2. Install Dependencies

```bash
# Install root dependencies (concurrently)
npm install

# Install client dependencies
cd client && npm install && cd ..

# Install server dependencies
cd server && npm install && cd ..

# Install test dependencies (optional)
cd tests && npm install && cd ..
```

### 3. Run in Development Mode

The easiest way to run both client and server is using the concurrent script:

```bash
npm run dev
```

This will start:
- **Backend server** on `http://localhost:3001`
- **Frontend client** on `http://localhost:5173`

Alternatively, run them separately:

```bash
# Terminal 1 - Server
npm run dev:server

# Terminal 2 - Client
npm run dev:client
```

### 4. Open the Application

Navigate to `http://localhost:5173` in your browser. The application will automatically create a new session or you can join an existing session via a shareable link.

## Running Tests

### Integration Tests

```bash
cd tests
npm test
```

See `tests/README.md` for detailed testing documentation.

### Test Coverage

```bash
cd tests
npm run test:coverage
```

## Building for Production

### Build Client and Server

```bash
npm run build
```

This will:
1. Build the client to `client/dist`
2. Build the server to `server/dist`

### Run Production Build

```bash
cd server
NODE_ENV=production npm start
```

The server will serve the client static files from `public/` directory.

## Docker Deployment

### Build Docker Image

```bash
docker build -t coding-platform .
```

### Run Docker Container

```bash
docker run -p 3000:3000 coding-platform
```

The application will be available at `http://localhost:3000`.

### Docker Image Details

- **Base Image**: `node:20-alpine` (lightweight Alpine Linux with Node.js 20)
- **Build**: Multi-stage build for optimized image size
- **Exposed Port**: 3000
- **Environment**: Production mode

## Cloud Deployment (Render.com)

This application is designed to deploy easily to Render.com:

1. Push code to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Render will automatically detect the Dockerfile
5. Set environment variable: `NODE_ENV=production`
6. Deploy!

## Environment Variables

### Development

```bash
# Server (.env)
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Client (.env)
VITE_API_URL=http://localhost:3001
```

### Production

```bash
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-app-domain.com
```

## Project Structure

```
02-end-to-end/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API and socket services
│   │   ├── types/         # TypeScript types
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   └── package.json
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── services/      # Business logic
│   │   ├── routes/        # API routes
│   │   ├── types/         # TypeScript types
│   │   ├── app.ts         # Express app
│   │   └── server.ts      # Server entry point
│   └── package.json
│
├── tests/                  # Integration tests
│   ├── integration/
│   └── package.json
│
├── Dockerfile              # Multi-stage Docker build
├── package.json            # Root package with scripts
└── README.md               # This file
```

## How It Works

### Real-time Collaboration

1. User opens the app and a session is created
2. Client connects to server via Socket.io
3. User joins the session room
4. Code changes are emitted with 300ms debounce
5. Server broadcasts changes to all connected clients
6. Remote changes update the local editor

### Code Execution

**JavaScript:**
- Executed using `Function` constructor with timeout
- Console output captured via proxy
- 5-second timeout prevents infinite loops

**Python:**
- Pyodide loaded lazily (only when Python is selected)
- Executed in isolated WebAssembly environment
- Standard library available
- Stdout captured for display

### Session Management

- Sessions stored in-memory Map
- Each session has unique ID (nanoid)
- 24-hour TTL with automatic cleanup
- Participant tracking per session

## API Endpoints

### REST API

- `POST /api/sessions` - Create new session
- `GET /api/sessions/:id` - Get session details
- `GET /health` - Health check

### WebSocket Events

**Client → Server:**
- `join-session` - Join a coding session
- `code-change` - Send code changes
- `language-change` - Change programming language

**Server → Client:**
- `session-state` - Initial session state
- `code-change` - Code updated by another user
- `language-change` - Language changed
- `participant-joined` - New participant joined
- `participant-left` - Participant left

## Troubleshooting

### Port Already in Use

If port 3001 or 5173 is already in use, modify the port in:
- Server: `server/src/server.ts`
- Client: Vite will auto-select next available port

### WebSocket Connection Failed

Ensure CORS is properly configured in `server/src/app.ts` and `server/src/server.ts`.

### Pyodide Not Loading

Pyodide is loaded from CDN. Check your internet connection or configure a different CDN URL in `client/src/services/executionService.ts`.

## Contributing

This is a homework project for AI Dev Tools Zoomcamp. Feel free to fork and enhance!

## License

MIT

## Acknowledgments

- AI Dev Tools Zoomcamp
- Monaco Editor team
- Pyodide project
- Socket.io team
