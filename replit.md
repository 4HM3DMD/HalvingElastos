# Elastos Halving Countdown Application

## Overview

This is a React-based single-page application that displays a countdown timer for the Elastos blockchain halving event. The application features an animated flip-card countdown display showing blocks remaining until the halving occurs. Built with React, TypeScript, and modern frontend tooling, it provides a visually engaging interface with responsive design and smooth animations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server, providing fast hot module replacement (HMR) and optimized production builds
- **Wouter** for lightweight client-side routing instead of React Router, chosen for its minimal bundle size

**UI Component System**
- **shadcn/ui** component library based on Radix UI primitives, providing accessible, unstyled components
- **Tailwind CSS** for utility-first styling with custom design tokens
- Components follow the "New York" style variant from shadcn/ui
- Custom CSS variables for theming (colors, border radius, spacing)

**State Management & Data Fetching**
- **TanStack Query (React Query)** for server state management with configured defaults:
  - No automatic refetching on window focus
  - Infinite stale time for cached data
  - Custom query functions with credential support
- Global query client configured with custom error handling

**Animation System**
- **Framer Motion** for declarative animations on the flip-card countdown display
- Custom keyframe animations defined in CSS for shimmer effects, fades, and marquee scrolling
- Responsive animation performance with memoized components

### Backend Architecture

**Server Framework**
- **Express.js** server with TypeScript
- Custom middleware for request/response logging with truncation for readability
- Development and production build configurations using esbuild for bundling

**Development Setup**
- **tsx** for running TypeScript in development mode
- Vite integrated as middleware in Express during development for seamless hot reloading
- Custom error overlay plugin for development debugging
- Replit-specific plugins (cartographer, dev-banner) for enhanced Replit IDE integration

**Storage Layer**
- In-memory storage implementation (`MemStorage`) providing a simple CRUD interface
- Interface-based design (`IStorage`) allows easy swapping to persistent storage
- Current implementation includes user management with UUID-based IDs

### Database Design

**ORM & Schema**
- **Drizzle ORM** configured for PostgreSQL with type-safe schema definitions
- **Neon Database** serverless PostgreSQL driver for production deployments
- Schema validation using **Zod** with Drizzle integration for runtime type checking

**Database Schema**
- `users` table with:
  - UUID primary key (auto-generated)
  - Unique username field
  - Password field (note: appears to store plain text - should implement hashing)
- Migrations stored in `./migrations` directory
- Schema defined in shared directory for both client and server access

**Session Management**
- **connect-pg-simple** for PostgreSQL-backed session storage
- Sessions configured to work with Express session middleware

### External Dependencies

**Core Dependencies**
- **@neondatabase/serverless** - Serverless PostgreSQL driver compatible with edge runtimes
- **drizzle-orm** & **drizzle-kit** - Type-safe ORM and migration tooling
- **express** - Web server framework
- **react** & **react-dom** - UI library
- **@tanstack/react-query** - Async state management
- **wouter** - Lightweight routing

**UI Component Libraries**
- **@radix-ui/** (multiple packages) - Headless UI components for accessibility
- **framer-motion** - Animation library
- **embla-carousel-react** - Carousel/slider component
- **lucide-react** - Icon library
- **class-variance-authority** & **clsx** - Utility for conditional className management
- **tailwind-merge** - Tailwind class merging utility

**Form Handling**
- **react-hook-form** - Form state management
- **@hookform/resolvers** - Validation resolver integration
- **zod** - Schema validation

**Development Tools**
- **@replit/vite-plugin-runtime-error-modal** - Error overlay for development
- **@replit/vite-plugin-cartographer** - Code navigation in Replit
- **@replit/vite-plugin-dev-banner** - Development environment indicator
- **typescript** - Static type checking
- **tailwindcss** & **autoprefixer** - CSS processing

**Utility Libraries**
- **date-fns** - Date manipulation and formatting
- **nanoid** - Unique ID generation
- **cmdk** - Command menu component