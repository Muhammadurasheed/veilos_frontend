# Project Structure & Organization

## Root Level Organization

```
/                           # Frontend React application
├── backend/               # Express.js API server
├── public/               # Static assets (avatars, logos, etc.)
├── src/                  # Frontend source code
└── .kiro/               # Kiro AI assistant configuration
```

## Frontend Structure (`/src`)

### Core Application
- `main.tsx` - Application entry point with providers
- `App.tsx` - Main app component with routing
- `App.css` & `index.css` - Global styles

### Feature-Based Organization
- `components/` - Reusable UI components organized by feature
  - `admin/` - Admin panel components
  - `auth/` - Authentication components
  - `chat/` - Chat and messaging components
  - `sanctuary/` - Group session components
  - `flagship/` - Enhanced sanctuary features
  - `ui/` - Base UI components (shadcn/ui)
- `pages/` - Route-level page components
- `contexts/` - React context providers for state management
- `hooks/` - Custom React hooks
- `services/` - API clients and external service integrations
- `types/` - TypeScript type definitions
- `utils/` - Utility functions and helpers
- `lib/` - Shared libraries and configurations
- `i18n/` - Internationalization files

## Backend Structure (`/backend`)

### Core Server
- `server.js` - Express server setup and configuration
- `package.json` - Backend dependencies and scripts

### Feature Modules
- `routes/` - API route handlers organized by feature
- `models/` - MongoDB/Mongoose data models
- `middleware/` - Express middleware functions
- `services/` - Business logic and external integrations
- `socket/` - Socket.io event handlers
- `config/` - Configuration files
- `utils/` - Backend utility functions
- `scripts/` - Database setup and maintenance scripts

## Key Conventions

### File Naming
- React components: PascalCase (`ExpertProfile.tsx`)
- Hooks: camelCase with `use` prefix (`useSocket.ts`)
- Services: camelCase (`sanctuaryApi.ts`)
- Types: camelCase (`sanctuary.ts`)
- Pages: PascalCase matching route names

### Import Aliases
- `@/*` resolves to `./src/*` for cleaner imports
- Use absolute imports for cross-feature dependencies
- Relative imports for same-feature files

### Component Organization
- Each major feature has its own component directory
- Shared UI components in `components/ui/`
- Page-specific components can be co-located with pages
- Complex features may have sub-directories (e.g., `sanctuary/breakout/`)

### State Management Patterns
- React Query for server state and caching
- React Context for global client state
- Local state with useState/useReducer for component state
- Custom hooks for complex state logic

### API Integration
- Service files in `services/` handle API communication
- Consistent error handling and response formatting
- Real-time features use Socket.io integration
- Authentication handled via JWT tokens