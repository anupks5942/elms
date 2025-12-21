# Employee Leave Management System (ELMS) - Project Context

## Overview

The Employee Leave Management System (ELMS) is a full-stack application consisting of a backend API built with ASP.NET Core Web API and a frontend built with Angular 17. The system was designed as a mini-project to demonstrate enterprise-level backend and frontend development concepts using modern technologies.

## Project Structure

```
elms/
├── backend/
│   ├── README.md
│   ├── start.sh
│   └── src/
│       ├── Elms.Api/          # ASP.NET Core Web API
│       │   ├── Controllers/
│       │   ├── Models/
│       │   ├── Services/
│       │   ├── Data/
│       │   ├── Dtos/
│       │   ├── appsettings.json
│       │   └── Program.cs
│       └── Elms.Api.Tests/    # Unit tests
└── frontend/
    ├── README.md
    ├── package.json
    ├── angular.json
    └── src/
        └── app/
            ├── core/
            │   ├── models/
            │   └── services/
            ├── features/
            │   ├── employee/
            │   └── manager/
            ├── shared/
            ├── app.component.ts
            └── app.routes.ts
```

## Backend (ASP.NET Core Web API)

### Features
- Employee leave application with date range selection
- Leave balance validation
- Manager approval/rejection workflow
- Asynchronous database operations
- Proper separation of concerns with services and repositories

### Technology Stack
- **Language:** C#
- **Framework:** ASP.NET Core Web API
- **ORM:** Entity Framework Core
- **Database:** SQL Server
- **Testing:** xUnit, Moq
- **Architecture:** REST API with Clean Architecture principles

### API Endpoints
- `POST /api/leaves/apply` - Submit leave request
- `GET /api/leaves/my?employeeId={id}` - View personal leave history
- `GET /api/leaves/pending` - View pending requests
- `PUT /api/leaves/approve/{id}` - Approve leave
- `PUT /api/leaves/reject/{id}` - Reject leave

### Key Components
- **Models:** Employee and LeaveRequest entities with LeaveStatus enum
- **Services:** LeaveService implementing ILeaveService interface
- **DTOs:** ApplyLeaveDto, LeaveResponseDto, UpdateLeaveStatusDto
- **Controllers:** LeavesController handling API requests
- **Data:** ApplicationDbContext with Entity Framework configuration

### Business Logic
- Leave days calculation excludes weekends
- Validation for sufficient leave balance
- Prevention of overlapping leave requests
- Manager approval/rejection workflow
- Leave balance reduction upon approval

## Frontend (Angular 17)

### Features
- Employee leave application form
- View personal leave history
- Manager dashboard for approving/rejecting pending leaves
- Simple user switching without authentication

### Technology Stack
- **Framework:** Angular 17
- **UI Components:** Angular Material
- **Architecture:** Standalone components
- **Forms:** Reactive Forms
- **HTTP Client:** HttpClient
- **Routing:** Angular Router

### Components
- **Core:** Models and services
  - `leave-request.model.ts` and `employee.model.ts`
  - `leave.service.ts` for API communication
- **Features:** Employee and Manager modules
  - `apply-leave.component.ts` - Form for applying leave
  - `my-leaves.component.ts` - List of employee's leave requests
  - `pending-leaves.component.ts` - Manager view of pending requests
- **Shared:** Reusable components
  - `user-switch.component.ts` - User switching dropdown

### User Switching
Since there's no real authentication, the frontend uses a "Act As User" dropdown to switch between different user roles:
- Employee 1 (Manager)
- Employee 2 (Employee)
- Employee 3 (Employee)

The selected user is stored in localStorage.

### API Integration
- Base URL: `http://localhost:5000/api`
- All API calls are wrapped in the LeaveService
- Error handling with Material Snackbar

## Building and Running

### Backend
1. Navigate to the backend directory: `cd backend`
2. Run the startup script: `./start.sh`
3. Alternatively, manually:
   - Navigate to `src/Elms.Api`
   - Run `dotnet restore`
   - Run `dotnet build`
   - Run `dotnet run`
4. The API will be available at `https://localhost:5001`

### Frontend
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start development server: `ng serve`
4. The application will be available at `http://localhost:4200`

## Development Conventions

### Backend
- Object-Oriented Programming principles (Encapsulation, Inheritance, Polymorphism, Abstraction)
- Dependency Injection
- Asynchronous programming with async/await
- Clean separation of concerns
- Input validation and error handling
- Business rule enforcement

### Frontend
- Standalone components architecture
- Reactive forms for user input
- Material Design components
- Service layer for API communication
- TypeScript interfaces for type safety
- Responsive design

## Architecture

The system follows a clean architecture approach with clear separation of concerns:
- **Controllers** handle HTTP requests and responses
- **Services** contain business logic
- **Models** represent data entities
- **DTOs** handle data transfer between layers
- **Data layer** manages database operations with Entity Framework Core

## Testing

The backend includes unit tests using xUnit and Moq. The frontend has been built with testability in mind, though specific test files weren't generated in this implementation.

## Success Criteria

The project successfully demonstrates:
- All APIs function as specified in the PRD
- Business rules are properly enforced
- Code follows clean architecture principles
- Project demonstrates strong .NET backend and Angular frontend development skills
- Solution can be clearly explained in technical interviews