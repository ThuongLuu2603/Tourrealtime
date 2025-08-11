# Tour Dashboard - Real-time Tour Management System

## Overview

TourDash is a Vietnamese tour management dashboard that provides real-time monitoring and analytics for both domestic and international tour packages. The application displays key performance indicators, hierarchical tour data, regional performance metrics, and recent booking activities. Built as a modern full-stack application, it enables tourism companies to track their business performance with comprehensive analytics and real-time data updates.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React with TypeScript**: Modern React application using functional components and hooks for type-safe development
- **Vite Build System**: Fast development server with hot module replacement and optimized production builds
- **TanStack Query**: Advanced server state management with automatic caching, background refetching, and real-time data synchronization
- **Shadcn/ui Components**: Professional UI component library built on Radix UI primitives for accessibility and consistent design
- **Tailwind CSS**: Utility-first styling framework with custom design tokens, CSS variables, and Vietnamese language support
- **Wouter**: Lightweight client-side routing solution for single-page application navigation

### Backend Architecture
- **Express.js with TypeScript**: RESTful API server handling tour data, metrics, and hierarchical business logic
- **In-Memory Storage**: Development-focused storage system with comprehensive mock data representing Vietnamese tour operations
- **Modular Route Structure**: Organized API endpoints for tours, hierarchy levels, regional performance, sales units, and dashboard metrics
- **Real-time Simulation**: API endpoints designed for frequent polling to simulate live business data updates

### Data Storage Solutions
- **Development Storage**: In-memory storage implementation with structured Vietnamese tour data including domestic and international categories
- **Drizzle ORM Configuration**: Database abstraction layer configured for PostgreSQL with comprehensive schema definitions
- **Hierarchical Data Model**: Structured relationships between tours, regions, sales units, and performance metrics supporting complex business analytics
- **PostgreSQL Ready**: Production database schema designed for Neon Database integration with proper indexing and relationships

### Authentication and Authorization
- **Session Infrastructure**: Basic session management framework using connect-pg-simple for PostgreSQL session storage
- **Development Mode**: Currently configured for internal dashboard use without authentication barriers
- **Scalable Foundation**: Architecture supports easy integration of user authentication and role-based access control

## External Dependencies

- **Neon Database**: Cloud PostgreSQL provider configured through Drizzle ORM for production data persistence
- **Radix UI Ecosystem**: Comprehensive set of accessible component primitives including dialogs, dropdowns, navigation, and form controls
- **Replit Integration**: Development environment optimizations with runtime error overlays and cartographer plugin for enhanced debugging
- **Build and Development Tools**: ESBuild for server bundling, Vite for frontend optimization, and TypeScript for type safety across the stack
- **UI Enhancement Libraries**: Date-fns for date manipulation, Embla Carousel for interactive components, and Class Variance Authority for component styling patterns