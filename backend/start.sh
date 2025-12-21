#!/bin/bash

# ELMS Startup Script

echo "Employee Leave Management System (ELMS)"
echo "Starting the API server..."

# Navigate to the project directory
cd /home/aks/AKS/Projects/elms/backend/src/Elms.Api

# Restore packages
echo "Restoring NuGet packages..."
dotnet restore

# Build the project
echo "Building the project..."
dotnet build

# Run the application
echo "Running the application..."
dotnet run