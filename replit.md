# Flight Booking Application

## Overview

This is a comprehensive flight booking application built with a modern full-stack architecture. The application features a dynamic multi-step flight booking form with conditional logic, allowing users to book flights with multiple segments and passengers. The frontend provides an intuitive interface with PDF generation capabilities, while the backend handles data validation and storage.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom airline-themed design system
- **Form Management**: React Hook Form with Zod validation
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with proper error handling and logging
- **Validation**: Zod schemas for runtime type safety
- **Session Management**: Express sessions with PostgreSQL storage

### Data Storage Solutions
- **Database**: PostgreSQL 16 with Drizzle ORM
- **Connection**: Neon Database serverless PostgreSQL
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Storage Interface**: Abstracted storage layer supporting both PostgreSQL and in-memory storage

## Key Components

### Flight Booking Form
- **Dynamic Flight Segments**: Users can select 1-6 flight segments with conditional rendering
- **Passenger Management**: Support for 1-6 passengers with individual baggage options
- **Real-time Validation**: Form validation with immediate feedback
- **PDF Generation**: Client-side PDF generation using jsPDF library

### Database Schema
- **Users Table**: Authentication and user management
- **Flight Bookings Table**: Comprehensive booking storage with JSON fields for complex data
- **Type Safety**: Full TypeScript integration with Drizzle-Zod

### UI Components
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Accessibility**: ARIA compliant components from Radix UI
- **Design System**: Consistent airline-themed color palette and typography
- **Component Library**: Comprehensive set of reusable UI components

## Data Flow

1. **User Input**: Form data is collected through controlled React components
2. **Client Validation**: Zod schemas validate data on the client side
3. **API Submission**: Validated data is sent to Express.js backend
4. **Server Validation**: Backend re-validates using shared Zod schemas
5. **Database Storage**: Drizzle ORM handles secure data persistence
6. **Response Handling**: Success/error responses trigger appropriate UI updates
7. **PDF Generation**: Optional client-side PDF generation for booking confirmations

## External Dependencies

### Core Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connection
- **ORM**: drizzle-orm and drizzle-kit for database operations
- **UI Components**: Extensive Radix UI component library
- **Form Handling**: @hookform/resolvers for form validation integration
- **Date Handling**: date-fns for date manipulation
- **PDF Generation**: jsPDF (loaded dynamically) for client-side PDF creation

### Development Dependencies
- **TypeScript**: Full type safety across frontend and backend
- **ESBuild**: Fast backend bundling for production
- **PostCSS**: CSS processing with Tailwind CSS
- **TSX**: TypeScript execution for development

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite development server with HMR
- **Backend Watching**: TSX for automatic TypeScript compilation
- **Port Configuration**: Frontend on port 5000, proxied through Express

### Production Build
- **Frontend**: Vite builds optimized static assets
- **Backend**: ESBuild creates single-file Node.js bundle
- **Static Serving**: Express serves built frontend assets
- **Database**: Automatic schema deployment with Drizzle migrations

### Replit Configuration
- **Modules**: Node.js 20, Web, and PostgreSQL 16
- **Deployment**: Autoscale deployment target
- **Build Command**: npm run build
- **Start Command**: npm run start
- **Port Mapping**: Internal port 5000 to external port 80

## Recent Changes

### June 24, 2025
- Redesigned PDF layout to match structured airline e-ticket format
- Removed company name/address/phone/email fields - logo upload only
- Updated flight segments to use structured boxes with manual fillable fields
- Changed passenger names to manual entry (no auto-suggestions)
- Replaced baggage checkboxes with quantity/weight input fields
- Removed payment section completely
- Removed contact information form section completely
- Added "1x 7kg Hand baggage, 1x Personal Bag included" as fixed text
- Both JavaScript and Python versions updated with new design

## Changelog
```
Changelog:
- June 18, 2025. Initial setup with professional e-ticket generator
- June 18, 2025. Added company branding feature with logo upload
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
Language: Urdu/English mix for explanations
Prefers Python alternatives when available
Wants separate folders for different implementations
```