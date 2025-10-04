# Overview

This is a full-stack web application built with React, TypeScript, Express, and PostgreSQL. The project appears to be a book recommendation platform where users can search for books and get personalized recommendations based on mood/genre preferences. The application uses a modern tech stack with shadcn/ui components for the frontend and Drizzle ORM for database management.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query (React Query) for server state management and data fetching

**UI Component System**
- shadcn/ui component library (Radix UI primitives with Tailwind CSS)
- "New York" style variant configured
- Comprehensive set of pre-built components (accordion, dialog, dropdown, form, etc.)
- Tailwind CSS for styling with custom theme configuration using CSS variables
- Component aliases configured for clean imports (@/components, @/lib, @/hooks)

**State Management**
- React Query for server state with custom query client configuration
- Local React state for UI interactions
- Custom hooks pattern (use-mobile, use-toast)

## Backend Architecture

**Server Framework**
- Express.js with TypeScript
- ESM module system (type: "module")
- Custom middleware for request logging and JSON response capture
- Centralized error handling middleware

**Development Setup**
- tsx for TypeScript execution in development
- esbuild for production bundling
- Separate development and production build processes
- Vite middleware integration for HMR in development

**API Design**
- RESTful API pattern with /api prefix for all routes
- Modular route registration system
- Storage abstraction layer for data operations

## Data Layer

**Database**
- PostgreSQL as the primary database (configured via Drizzle)
- Neon serverless driver (@neondatabase/serverless)
- Drizzle ORM for type-safe database operations
- Migration support with drizzle-kit
- Schema-first approach with Zod validation integration

**Storage Pattern**
- Interface-based storage abstraction (IStorage)
- In-memory implementation (MemStorage) for development/testing
- Designed for easy swapping to database-backed implementation
- CRUD operations abstracted through storage interface

**Schema Design**
- Users table with UUID primary keys
- Username/password authentication fields
- Drizzle-Zod integration for runtime validation
- Type inference for Insert and Select operations

## External Dependencies

**Database Services**
- Neon PostgreSQL (serverless PostgreSQL hosting)
- Connection via DATABASE_URL environment variable

**UI Component Libraries**
- Radix UI primitives for accessible components
- Embla Carousel for carousel functionality
- cmdk for command palette
- Lucide React for icons
- date-fns for date manipulation

**Development Tools**
- Replit-specific plugins for development environment:
  - Runtime error modal overlay
  - Cartographer (code navigation)
  - Dev banner

**Session Management**
- connect-pg-simple for PostgreSQL-backed sessions (installed but not yet implemented)

**Form Management**
- React Hook Form with Hookform Resolvers
- Zod for schema validation
- Integration with shadcn/ui form components

**Build & Bundling**
- Vite with React plugin
- PostCSS with Tailwind CSS and Autoprefixer
- esbuild for server bundling