# Employee Leave Management System (ELMS) - Project Context

## Overview
The Employee Leave Management System (ELMS) is a backend-focused project built using C# and ASP.NET Core Web API. Based on the Product Requirements Document (PRD), this is a mini-project designed to demonstrate strong fundamentals in enterprise-level backend development concepts.

**Project Purpose:** A centralized system for managing employee leave requests with automated workflows, validation, and approval mechanisms.

## Technology Stack
- **Language:** C#
- **Framework:** ASP.NET Core Web API
- **ORM:** Entity Framework Core
- **Database:** In-Memory / SQL Server
- **Testing:** xUnit, Moq
- **Architecture:** REST API with Clean Architecture principles

## Key Features
1. **Employee Management:**
   - Store employee details
   - Track leave balances per employee

2. **Leave Application:**
   - Employees can apply for leave with start/end dates
   - Automatic calculation of total leave days
   - Default status: Pending

3. **Leave Validation:**
   - Validate against remaining leave balance
   - Ensure end date >= start date
   - Prevent overlapping requests (enhancement)

4. **Approval Workflow:**
   - Managers can approve/reject leave requests
   - Approved leaves reduce employee balance
   - Rejected leaves don't affect balance

## Project Structure
The project is organized as follows:
```
backend/
├── README.md
├── start.sh
└── src/
    ├── Elms.Api/
    │   ├── Controllers/
    │   │   └── LeavesController.cs
    │   ├── Models/
    │   │   ├── Employee.cs
    │   │   └── LeaveRequest.cs
    │   ├── Services/
    │   │   ├── ILeaveService.cs
    │   │   └── LeaveService.cs
    │   ├── Data/
    │   │   └── ApplicationDbContext.cs
    │   ├── Dtos/
    │   │   └── LeaveDtos.cs
    │   ├── Program.cs
    │   └── Elms.Api.csproj
    └── Elms.Api.Tests/
        ├── LeaveServiceTests.cs
        └── Elms.Api.Tests.csproj
```

## API Endpoints
### Employee APIs:
- `POST /api/leaves/apply` - Submit leave request
- `GET /api/leaves/my` - View personal leave history

### Manager APIs:
- `GET /api/leaves/pending` - View pending requests
- `PUT /api/leaves/approve/{id}` - Approve leave
- `PUT /api/leaves/reject/{id}` - Reject leave

## Development Principles
- Object-Oriented Programming (Encapsulation, Inheritance, Polymorphism, Abstraction)
- Dependency Injection
- Asynchronous programming with async/await
- Clean separation of concerns
- Input validation and error handling
- Business rule enforcement

## Building and Running
1. Navigate to the backend directory: `cd /home/aks/AKS/Projects/elms/backend`
2. Run the startup script: `./start.sh`
3. Alternatively, navigate to the src/Elms.Api directory and run:
   - `dotnet restore` to restore packages
   - `dotnet build` to build the project
   - `dotnet run` to start the API server
4. Visit `https://localhost:5001/swagger` to view the API documentation

## Testing
Run the tests using:
```bash
cd /home/aks/AKS/Projects/elms/backend/src/Elms.Api.Tests
dotnet test
```

## Current State
The project structure has been created with the following components implemented:
- Data models (Employee and LeaveRequest)
- Entity Framework Core context with in-memory database
- Service layer with business logic
- API controllers with proper error handling
- DTOs for API requests and responses
- Unit tests for core functionality
- Basic startup script and documentation

## Next Steps
To enhance the project:
1. Add more comprehensive unit and integration tests
2. Implement JWT Authentication & Authorization
3. Add more sophisticated validation
4. Implement email notifications
5. Add audit logging
6. Consider adding a frontend UI

## Success Criteria
- All APIs function as specified in the PRD
- Business rules are properly enforced
- Code follows clean architecture principles
- Project demonstrates strong .NET backend development skills
- Solution can be clearly explained in technical interviews