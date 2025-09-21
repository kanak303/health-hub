# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

HealthHub is a healthcare management system built with Node.js, TypeScript, Express, and Sequelize ORM. The application provides functionality for managing users (patients, doctors, admins), bookings, clinics, payments, and scheduling in a healthcare environment.

## Development Commands

### Setup and Installation
```bash
npm install
```

### Development Server
```bash
npm run dev              # Start development server with hot reload using ts-node-dev
npm start                # Start production server using ts-node
```

### Building
```bash
npm run build           # Compile TypeScript to JavaScript in dist/ directory
```

### Database Operations
```bash
npm run prisma:generate  # Generate Prisma client (though project uses Sequelize)
npm run prisma:migrate   # Run Prisma migrations (though project uses Sequelize)
```

### Testing
```bash
npm test                # Run Jest tests
```

### Single Test File
To run a specific test file, use Jest directly:
```bash
npx jest tests/unit/specific-test.spec.ts
npx jest tests/integration/specific-integration.spec.ts
```

## Architecture Overview

### Project Structure
The application follows a modular architecture pattern:

```
src/
├── config/          # Database configuration and connections
├── middleware/      # Express middleware (auth, validation, error handling)
├── modules/         # Feature modules organized by domain
│   ├── auth/        # Authentication (login, register, JWT)
│   ├── bookings/    # Appointment booking system
│   ├── clinic/      # Clinic management
│   ├── doctors/     # Doctor profiles and management
│   ├── payments/    # Payment processing
│   ├── schedules/   # Doctor scheduling
│   ├── slots/       # Available time slots
│   └── user/        # User management (patients, doctors, admins)
├── utils/           # Utility functions (logger, error handling, tokens)
├── emails/          # Email templates and services
├── db/              # Database-related files
└── domain/          # Domain models and business logic
```

### Technology Stack
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: Zod for schema validation
- **Security**: Helmet, CORS, express-rate-limit
- **Logging**: Pino logger
- **Testing**: Jest with Supertest for integration tests

### Module Pattern
Each feature module typically contains:
- `*Controller.ts` - HTTP request handlers
- `*Routes.ts` - Route definitions
- `*Services.ts` - Business logic
- `*Models.ts` - Database models (Sequelize)

### Database Architecture
The application uses Sequelize ORM with MySQL. Key models include:
- **User**: Supports three roles - admin, doctor, patient
- **Bookings**: Appointment management
- **Clinics**: Healthcare facility management
- **Schedules/Slots**: Time management for appointments
- **Payments**: Financial transaction handling

### Entry Point
The main server file (`server.ts`) handles:
- Database connection and synchronization
- Basic Express app setup
- Server initialization with database authentication

## Development Notes

### Environment Configuration
The application uses environment variables for configuration:
- `DB_NAME`, `DB_USER`, `DB_PASS`, `DB_HOST` for database connection
- `PORT` for server port (defaults to 3000)
- `NODE_ENV` for environment setting

### Database Management
- The app uses Sequelize with MySQL
- Database connection is configured in `src/config/database.ts`
- Models are synchronized on server startup with `{ force: true }` (recreates tables)
- User model includes UUID primary keys and role-based access (admin/doctor/patient)

### Code Organization
- TypeScript compilation outputs to `dist/` directory
- Both `.ts` source files and compiled `.js`/`.d.ts` files are present
- Modular architecture allows for easy feature expansion
- Middleware includes authentication, validation, and error handling

### Testing Structure
- Tests are organized in `tests/unit/` and `tests/integration/`
- Jest is configured for TypeScript support with ts-jest
- Supertest is available for API endpoint testing

## Codebase Patterns

### Authentication Flow
The system implements JWT-based authentication with role-based access control supporting three user types: admin, doctor, and patient.

### Error Handling
Centralized error handling is implemented through middleware in `src/middleware/errorHandler.ts`.

### Validation
Input validation uses Zod schemas, with validation middleware in `src/middleware/validate.ts`.

### Logging
Structured logging is implemented using Pino logger for better observability.