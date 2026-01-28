## Authentication

### Register Admin User
```bash
curl -X POST http://localhost:3000/auth/register \
-H "Content-Type: application/json" \
-d '{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123",
  "role": "ADMIN"
}'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "admin@example.com",
  "password": "password123"
}'
```

Copy the returned `accessToken` and use it as:
```
Authorization: Bearer <TOKEN>
```

## Users (ADMIN only)

### Get All Users
```bash
curl http://localhost:3000/users \
-H "Authorization: Bearer <ADMIN_TOKEN>"
```

### Update User Role
```bash
curl -X PATCH http://localhost:3000/users/2 \
-H "Authorization: Bearer <ADMIN_TOKEN>" \
-H "Content-Type: application/json" \
-d '{
  "role": "ADMIN"
}'
```

## Customers

### Create Customer (ADMIN)
```bash
curl -X POST http://localhost:3000/customers \
-H "Authorization: Bearer <ADMIN_TOKEN>" \
-H "Content-Type: application/json" \
-d '{
  "name": "Acme Corp",
  "email": "contact@acme.com",
  "phone": "9999999999"
}'
```

### Get Customers (Pagination)
```bash
curl "http://localhost:3000/customers?page=1&limit=5" \
-H "Authorization: Bearer <TOKEN>"
```

### Search Customers (Bonus Feature)
```bash
curl "http://localhost:3000/customers?search=acme" \
-H "Authorization: Bearer <TOKEN>"
```

### Get Customer By ID
```bash
curl http://localhost:3000/customers/1 \
-H "Authorization: Bearer <TOKEN>"
```

### Delete Customer (ADMIN)
```bash
curl -X DELETE http://localhost:3000/customers/1 \
-H "Authorization: Bearer <ADMIN_TOKEN>"
```

## Tasks

### Create Task (ADMIN)
```bash
curl -X POST http://localhost:3000/tasks \
-H "Authorization: Bearer <ADMIN_TOKEN>" \
-H "Content-Type: application/json" \
-d '{
  "title": "Prepare contract",
  "description": "Draft contract for customer",
  "assignedToId": 2,
  "customerId": 1
}'
```

### Get Tasks
```bash
curl http://localhost:3000/tasks \
-H "Authorization: Bearer <TOKEN>"
```

**ADMIN** sees all tasks  
**EMPLOYEE** sees only assigned tasks

### Update Task Status
```bash
curl -X PATCH http://localhost:3000/tasks/1/status \
-H "Authorization: Bearer <EMPLOYEE_TOKEN>" \
-H "Content-Type: application/json" \
-d '{
  "status": "DONE"
}'
```
