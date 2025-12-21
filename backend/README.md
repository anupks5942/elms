# Employee Leave Management System (ELMS) - Backend

This is the backend API for the Employee Leave Management System, built with ASP.NET Core Web API and Entity Framework Core.

## Overview

The ELMS backend provides RESTful APIs for managing employee leave requests with automated workflows, validation, and approval mechanisms. It demonstrates enterprise-level backend development concepts using modern .NET technologies.

## Features

- Employee leave application with date range selection
- Leave balance validation
- Manager approval/rejection workflow
- Asynchronous database operations
- Proper separation of concerns with services and repositories

## Technology Stack

- **Language:** C#
- **Framework:** ASP.NET Core Web API
- **ORM:** Entity Framework Core
- **Database:** In-Memory (for development) / SQL Server
- **Testing:** xUnit, Moq

## API Endpoints

### Employee APIs:
- `POST /api/leaves/apply` - Submit leave request
- `GET /api/leaves/my?employeeId={id}` - View personal leave history

### Manager APIs:
- `GET /api/leaves/pending` - View pending requests
- `PUT /api/leaves/approve/{id}` - Approve leave
- `PUT /api/leaves/reject/{id}` - Reject leave

## Getting Started

1. Ensure you have .NET 6 SDK installed
2. Clone the repository
3. Navigate to `/backend/src/Elms.Api`
4. Run `dotnet restore` to restore packages
5. Run `dotnet run` to start the API server
6. Visit `https://localhost:5001/swagger` to view the API documentation

## Running the Application

You can run the application using the provided startup script:

```bash
./start.sh
```

Or manually:

```bash
cd /path/to/elms/backend/src/Elms.Api
dotnet run
```

## Project Structure

- `Controllers/` - Contains API controllers
- `Models/` - Contains data models (Employee, LeaveRequest)
- `Dtos/` - Contains data transfer objects for API requests/responses
- `Services/` - Contains business logic services
- `Data/` - Contains Entity Framework context and configurations