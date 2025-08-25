# Quiz React TypeScript Application

## Overview

This is a sales quiz application for "Protocolo Reset da Barriga" built with React, TypeScript, and a modern web stack. The application creates an interactive 14-page quiz funnel designed to segment users and guide them through a personalized sales experience based on their responses about weight loss struggles.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: React hooks for local component state, with quiz state managed through useState
- **Data Fetching**: TanStack Query (React Query) for server state management

### Component Structure
- **Quiz Flow**: Multi-page quiz component (`QuizResetBarriga`) that manages navigation and state
- **UI Components**: Reusable components from Shadcn/ui for consistent design
- **Type Safety**: Strong TypeScript interfaces for quiz state, user responses, and scoring logic

### Backend Architecture
- **Server**: Express.js with TypeScript for API endpoints
- **Development**: Hot module replacement with Vite middleware integration
- **Storage Interface**: Abstracted storage layer with in-memory implementation
- **Session Management**: PostgreSQL session store configuration ready

### Data Management
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: User management schema with UUID primary keys
- **Migrations**: Drizzle Kit for database schema management
- **Validation**: Zod schemas integrated with Drizzle for runtime validation

### Styling System
- **Design Tokens**: CSS custom properties for consistent theming
- **Component Variants**: Class Variance Authority (CVA) for component styling variants
- **Responsive Design**: Mobile-first approach with Tailwind responsive utilities
- **Accessibility**: Radix UI primitives ensure ARIA compliance and keyboard navigation

### Development Tools
- **Type Checking**: Strict TypeScript configuration with path mapping
- **Code Quality**: ESM modules with modern JavaScript features
- **Hot Reload**: Vite development server with React Fast Refresh
- **Error Handling**: Runtime error modal for development debugging

## External Dependencies

### UI and Styling
- **Radix UI**: Comprehensive primitive components for accessibility and functionality
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Utility for managing component variants

### Data and State
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form management with validation
- **Zod**: Runtime type validation and schema definition
- **Date-fns**: Date manipulation and formatting utilities

### Database and Backend
- **Drizzle ORM**: Type-safe SQL query builder and ORM
- **Neon Database**: Serverless PostgreSQL database service
- **Connect PG Simple**: PostgreSQL session store for Express

### Development
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking and enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Autoprefixer

### Quiz Logic
- **Scoring System**: Custom utility functions for calculating user segments and recommendations
- **State Management**: React hooks for managing quiz progression and user responses
- **Type Definitions**: Comprehensive TypeScript interfaces for quiz data structures