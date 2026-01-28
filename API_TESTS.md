# Prysm Mini CRM – API Test Evidence

This file contains curl commands used to validate all APIs.

---

## Authentication

### Register Admin
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "password123",
    "role": "ADMIN"
  }'
Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
Customers
Create Customer
curl -X POST http://localhost:3000/customers \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Corp",
    "email": "contact@acme.com",
    "phone": "9999999999"
  }'
Get Customers (Pagination)
curl "http://localhost:3000/customers?page=1&limit=5" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
Tasks
Create Task
curl -X POST http://localhost:3000/tasks \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Prepare contract",
    "assignedToId": 2,
    "customerId": 1
  }'
Update Task Status
curl -X PATCH http://localhost:3000/tasks/1/status \
  -H "Authorization: Bearer <EMPLOYEE_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "DONE"
  }'