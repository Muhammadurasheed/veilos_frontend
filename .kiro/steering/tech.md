# Technology Stack & Build System

## Frontend Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC plugin for fast compilation
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom Veilo brand colors and animations
- **State Management**: React Query (@tanstack/react-query) for server state
- **Routing**: React Router DOM v6
- **Real-time**: Socket.io client for WebSocket connections
- **Video/Audio**: Agora RTC SDK for video calls
- **Forms**: React Hook Form with Zod validation
- **Internationalization**: i18next with react-i18next

## Backend Stack

- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Cache**: Redis for session management
- **Authentication**: JWT tokens with bcryptjs for password hashing
- **Real-time**: Socket.io server with enhanced handlers
- **File Upload**: Multer with Cloudinary integration
- **Security**: Helmet, CORS, express-rate-limit
- **Payment**: Stripe integration
- **Video**: Agora access token generation

## Development Tools

- **TypeScript**: Strict configuration with path aliases (@/* -> ./src/*)
- **ESLint**: React hooks and TypeScript rules
- **Package Manager**: npm (frontend and backend)
- **Environment**: dotenv for configuration management

## Common Commands

### Frontend Development
```bash
npm run dev          # Start Vite dev server on port 8080
npm run build        # Production build
npm run build:dev    # Development build
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Backend Development
```bash
cd backend
npm run dev          # Start with nodemon (auto-reload)
npm start            # Production start
```

### Full Stack Development
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
npm run dev
```

## Configuration Notes

- Frontend dev server proxies `/api` requests to `http://localhost:3000`
- Backend runs on port 3000, frontend on port 8080
- TypeScript strict mode disabled for flexibility (`noImplicitAny: false`)
- Tailwind includes custom Veilo brand colors and animations
- Socket.io admin UI available at `/admin` namespace