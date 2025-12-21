# Product Requirements Document (PRD)

## Product Name

Employee Leave Management System (ELMS)

## Version

1.0

## Author

Ayush

## Date

December 2025

---

## 1. Purpose

The purpose of this document is to define the functional and non-functional requirements for the **Employee Leave Management System (ELMS)**. The system is designed as a mini-project to demonstrate strong fundamentals in **C#, Object-Oriented Programming, ASP.NET Core Web API, Entity Framework Core, Dependency Injection, Asynchronous Programming, Validation, and Testing**.

This PRD serves as a single source of truth for development, evaluation, and interview explanation.

---

## 2. Problem Statement

In many organizations, employee leave requests are managed manually or through informal communication, leading to:

* Lack of transparency
* Errors in leave balance calculation
* No standardized approval workflow
* Difficulty in tracking leave history

The Employee Leave Management System aims to digitize and automate this process through a secure, structured, and scalable backend system.

---

## 3. Goals & Objectives

### Primary Goals

* Provide a centralized system for managing employee leave
* Enforce business rules for leave application and approval
* Demonstrate real-world backend development concepts

### Learning Objectives

* Apply OOP principles (Encapsulation, Inheritance, Polymorphism, Abstraction)
* Build RESTful APIs using ASP.NET Core
* Implement EF Core with Code-First approach
* Use Dependency Injection and async/await correctly
* Handle validation, exceptions, and testing

---

## 4. Target Users & Roles

### 4.1 Employee

* Applies for leave
* Views own leave requests
* Checks remaining leave balance

### 4.2 Manager

* Reviews employee leave requests
* Approves or rejects leave
* Enforces approval rules

---

## 5. Scope

### In Scope

* REST API–based backend
* Employee and Manager roles (logical, not UI-based)
* Leave application, approval, and rejection workflow
* Leave balance validation
* Asynchronous database operations

### Out of Scope

* Frontend UI
* Payroll integration
* Email/SMS notifications
* Advanced role-based authentication (JWT – future scope)

---

## 6. Functional Requirements

### 6.1 Employee Management

* System shall store employee details
* Each employee shall have a predefined leave balance

### 6.2 Leave Application

* Employee can apply for leave with start and end dates
* System shall calculate total leave days automatically
* Leave request status shall default to **Pending**

### 6.3 Leave Validation Rules

* Leave days must not exceed remaining leave balance
* End date must be greater than or equal to start date
* Overlapping leave requests should be restricted (optional enhancement)

### 6.4 Leave Approval

* Only managers can approve or reject leave
* Approved leave shall reduce employee leave balance
* Rejected leave shall not affect leave balance

### 6.5 Leave Status Management

* Supported statuses:

  * Pending
  * Approved
  * Rejected

---

## 7. API Requirements

### 7.1 Employee APIs

| Method | Endpoint          | Description                 |
| ------ | ----------------- | --------------------------- |
| POST   | /api/leaves/apply | Apply for leave             |
| GET    | /api/leaves/my    | View employee leave history |

### 7.2 Manager APIs

| Method | Endpoint                 | Description           |
| ------ | ------------------------ | --------------------- |
| GET    | /api/leaves/pending      | View pending requests |
| PUT    | /api/leaves/approve/{id} | Approve leave         |
| PUT    | /api/leaves/reject/{id}  | Reject leave          |

---

## 8. Data Requirements

### 8.1 Entities

#### Employee

* Id (Primary Key)
* Name
* LeaveBalance

#### LeaveRequest

* Id (Primary Key)
* EmployeeId (Foreign Key)
* StartDate
* EndDate
* Status

### 8.2 Relationships

* One Employee can have multiple Leave Requests

---

## 9. Non-Functional Requirements

### Performance

* All database operations must be asynchronous

### Scalability

* Service-based architecture using Dependency Injection

### Reliability

* Centralized exception handling using middleware

### Maintainability

* Clean separation of concerns (Controllers, Services, Models)

---

## 10. Security Requirements (Basic)

* Input validation using DTOs and data annotations
* Role checks at service level (Manager vs Employee)
* No direct entity exposure to API consumers

---

## 11. Error Handling

* Invalid requests shall return appropriate HTTP status codes
* Business rule violations shall return descriptive error messages
* Unhandled exceptions shall be captured by global middleware

---

## 12. Technology Stack

| Layer        | Technology               |
| ------------ | ------------------------ |
| Language     | C#                       |
| Framework    | ASP.NET Core Web API     |
| ORM          | Entity Framework Core    |
| Database     | In-Memory / SQL Server   |
| Testing      | xUnit, Moq               |
| Architecture | REST, Clean Architecture |

---

## 13. Assumptions

* All users are pre-registered
* Leave balance is initialized manually
* Manager identification is handled logically (not via auth)

---

## 14. Risks & Mitigation

| Risk                        | Mitigation                   |
| --------------------------- | ---------------------------- |
| Incorrect leave calculation | Centralized business logic   |
| Unauthorized approvals      | Manager role checks          |
| Data inconsistency          | EF Core + async transactions |

---

## 15. Future Enhancements

* JWT Authentication & Authorization
* Role-based access control
* SQL Server with migrations
* Frontend UI (Angular/React)
* Email notifications
* Audit logs

---

## 16. Success Criteria

The project will be considered successful if:

* All APIs work as expected
* Business rules are enforced correctly
* Code follows clean architecture principles
* The project can be clearly explained in interviews

---

## 17. Conclusion

The Employee Leave Management System is a well-scoped mini-project that demonstrates real-world backend development skills using modern .NET technologies. It effectively bridges academic concepts with industry practices.