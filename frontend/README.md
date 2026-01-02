# Employee Leave Management System - Frontend

This is the Angular 17 frontend for the Employee Leave Management System (ELMS).

## Features

- Employee leave application form
- View personal leave history
- Manager dashboard for approving/rejecting pending leaves
- Simple user switching without authentication

## Tech Stack

- Angular 17
- Angular Material
- Standalone components
- HttpClient
- Reactive Forms
- Routing

## Prerequisites

- Node.js (v16 or higher)
- Angular CLI (v17 or higher)

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
ng serve
```

3. Open your browser to `http://localhost:4200`

## Configuration

The application connects to the backend API at `http://localhost:52767/api`. This can be modified in the environment files:

- `src/environments/environment.ts`
- `src/environments/environment.development.ts`

## User Switching

Since there's no real authentication, use the "Act As User" dropdown to switch between different user roles:
- Employee 1 (Manager)
- Employee 2 (Employee)
- Employee 3 (Employee)

The selected user is stored in localStorage.