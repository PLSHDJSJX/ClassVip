# Overview

This is an interactive classroom management web application for class XI-TKJ-2 that provides a digital classroom seating chart and gallery system. The application features an interactive seat map where users can click on individual seats to view student profiles, along with a media gallery for sharing class photos and videos. The system includes admin functionality for managing student data and gallery content through a secure dashboard interface.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built with React 18 using TypeScript, organized as a Single Page Application (SPA) with client-side routing via Wouter. The UI follows a modern component-based architecture using Radix UI primitives with shadcn/ui components for consistent design patterns. Styling is implemented with Tailwind CSS featuring a custom design system with CSS variables for theming support including dark mode. The application uses TanStack Query (React Query) for efficient server state management and data fetching with built-in caching and synchronization.

## Backend Architecture
The server runs on Express.js with TypeScript, following a RESTful API design pattern. The application uses a repository pattern for data access through a storage layer that abstracts database operations. File upload functionality is handled via Multer middleware with configurable storage limits and file type validation. The server implements middleware for request logging, JSON parsing, and error handling with proper HTTP status codes.

## Authentication & Authorization
The system uses a simple session-based authentication mechanism with hardcoded admin credentials for demonstration purposes. Admin sessions are managed server-side with session validation middleware protecting administrative endpoints. The frontend implements role-based UI rendering, showing admin controls only to authenticated administrators.

## Database Design
The application uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations. The schema includes four main entities:
- Users table for admin authentication
- Students table with seat assignments, photos, and personal information
- Gallery items for media content with support for both images and videos
- Slides table for flexible content management with JSON storage

All tables use UUID primary keys and include proper timestamp tracking for audit trails.

## Data Flow & State Management
The application implements a unidirectional data flow pattern where React Query manages server state synchronization. Local component state handles UI interactions while server state mutations trigger automatic cache invalidation and refetching. The system uses optimistic updates for better user experience with rollback capabilities on failure.

# External Dependencies

## Database & ORM
- PostgreSQL database hosted via Neon serverless platform
- Drizzle ORM with Drizzle Kit for schema management and migrations
- Connection pooling through Neon's serverless driver

## UI Framework & Components
- React 18 with TypeScript for type safety
- Radix UI primitives providing accessible component foundations
- shadcn/ui component library built on top of Radix UI
- Tailwind CSS for utility-first styling with custom design tokens
- Lucide React for consistent iconography

## Data Management
- TanStack Query for server state management and caching
- React Hook Form with Zod resolvers for form validation
- Date-fns for date manipulation and formatting

## Development Tools
- Vite as the build tool and development server
- Replit-specific plugins for development environment integration
- ESBuild for production bundling
- TypeScript for static type checking across the entire codebase

## File Handling
- Multer for multipart form data and file upload processing
- File system storage with configurable upload directories
- MIME type validation for security