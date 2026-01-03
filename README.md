# 7 Wonders Duel

A digital implementation of the board game 7 Wonders Duel built with React, Redux, and WebSocket multiplayer support.

## Prerequisites

- Node.js 24 or higher
- Yarn package manager

## Installation

```bash
yarn install
```

## Development

This project uses Vite for fast development and WebSocket for real-time multiplayer.

### Starting the Application

You need to run both the WebSocket server and the Vite dev server:

**Terminal 1 - Start the WebSocket server:**

```bash
yarn dev-server
```

The server runs on `http://localhost:8080` with auto-reload via nodemon

**Terminal 2 - Start the Vite dev server:**

```bash
yarn dev-ui
```

The client runs on `http://localhost:5173` (default Vite port)

### How It Works

- The **Vite dev server** serves the React application with hot module replacement
- The **WebSocket server** handles real-time game state synchronization between players
- The client automatically connects to the WebSocket server at `localhost:8080`
- Open two browser windows to test multiplayer functionality

## Available Scripts

### `yarn dev-ui`

Runs the Vite dev server with hot reload at [http://localhost:5173](http://localhost:5173)

### `yarn dev-server`

Starts the WebSocket server on port 8080 with auto-reload for development

### `yarn start-server`

Starts the WebSocket server on port 8080 for production (no auto-reload)

### `yarn build`

Builds the app for production to the `dist` folder using Vite

### `yarn preview`

Preview the production build locally

### `yarn test`

Runs the test suite with Jest

### `yarn type-check`

Runs TypeScript type checking without emitting files

## Production Build

```bash
yarn build
```

The optimized production build will be in the `dist` folder, ready for deployment.

## Learn More

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://reactjs.org/)
- [Socket.IO Documentation](https://socket.io/)
