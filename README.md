# Mini CRM Backend

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

A role-based CRM backend built with NestJS, PostgreSQL, Prisma ORM, and JWT authentication. Implements secure authentication, user management, customer management, and task workflows with full API documentation via Swagger.

## Tech Stack

* Node.js
* NestJS
* PostgreSQL
* Prisma ORM
* JWT Authentication
* Swagger API Docs

## Features

* JWT-based Authentication (ADMIN / EMPLOYEE roles)
* User Management (Admin only)
* Customer CRUD with Pagination
* Task Assignment and Status Management
* Role-based Access Control
* Swagger Interactive API Documentation
* Input validation using DTOs
* Prisma migrations and schema management
* Pagination support for customer listing

## 📸 API Documentation Preview (Swagger)

Swagger provides an interactive UI to explore and test all APIs with JWT authentication.

### 🔹 API Overview
![Swagger Home](docs/home.png)

### 🔹 JWT Authorization
![Swagger Auth](docs/authorize.png)

### 🔹 Endpoint Testing Example
![Swagger Endpoint](docs/create_task.png)


## Roles & Permissions

| Role | Permissions |
|------|-------------|
| ADMIN | Manage users, customers, tasks |
| EMPLOYEE | View customers, manage own tasks |

## Error Handling

| Status Code | Meaning |
|-------------|---------|
| 400 | Validation error |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Resource not found |
| 409 | Duplicate record |

## Project Setup

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd prysm-mini-crm/backend
```

### 2. Install Dependencies
```bash
npm install
```

## Environment Variables

Create a `.env` file in the backend root.

### .env.example
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/prysm_crm"
JWT_SECRET="super-secret-jwt-key"
PORT=3000
```

**Note:** Replace credentials based on your local PostgreSQL setup.

## Database Setup & Migration (Prisma)

### 1. Make sure PostgreSQL is running
```bash
sudo service postgresql start
```

### 2. Create Database (if not exists)

Login to postgres shell:
```bash
psql -U postgres
```
```sql
CREATE DATABASE prysm_crm;
```

Exit:
```
\q
```

### 3. Run Prisma Migration
```bash
npx prisma migrate dev --name init
```

This will:
* Create tables
* Apply schema
* Generate Prisma client

### 4. (Optional) Prisma Studio

To visually inspect database:
```bash
npx prisma studio
```

## Running the Server

### Development Mode
```bash
npm run start:dev
```

### Production Build
```bash
npm run build
node dist/src/main.js
```

Server will start at:
```
http://localhost:3000
```

## Swagger API Documentation

Once server is running, open:
```
http://localhost:3000/api
```

### Swagger Features

* All endpoints documented
* Request/response schemas visible
* JWT authentication supported
* Execute APIs directly from browser

### Using JWT in Swagger

1. Call `/auth/login`
2. Copy the returned `accessToken`
3. Click Authorize button in Swagger
4. Paste:
```
Bearer YOUR_TOKEN_HERE
```

5. Now you can access protected APIs.

## Example API Testing

### Register User
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

### Get Customers (Authorized)
```bash
curl http://localhost:3000/customers \
-H "Authorization: Bearer YOUR_TOKEN"
```

### Create Task (ADMIN)
```bash
curl -X POST http://localhost:3000/tasks \
-H "Authorization: Bearer YOUR_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "title": "Prepare contract",
  "description": "Draft contract for customer",
  "assignedToId": 2,
  "customerId": 1
}'
```

## Bonus Feature: Customer Search Filter

The Customers API supports searching customers by name, email, or phone number.

### Endpoint
```
GET /customers?search=<query>
```

### Description

Filters customers whose:
* **name** contains the query (case-insensitive)
* OR **email** contains the query (case-insensitive)
* OR **phone** contains the query

Search works together with pagination parameters (page, limit).

### Example Usage

Search customers containing "acme":
```bash
curl "http://localhost:3000/customers?search=acme" \
-H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Example Response
```json
{
  "page": 1,
  "limit": 10,
  "totalRecords": 1,
  "totalPages": 1,
  "data": [
    {
      "id": 1,
      "name": "Acme Corp",
      "email": "contact@acme.com",
      "phone": "9999999999",
      "company": "Acme",
      "createdAt": "2026-01-27T21:01:09.024Z",
      "updatedAt": "2026-01-27T21:01:09.024Z"
    }
  ]
}
```

### Combined Pagination + Search
```bash
curl "http://localhost:3000/customers?search=corp&page=1&limit=5" \
-H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Access Control

* **ADMIN** → Can search all customers
* **EMPLOYEE** → Read-only search access

## Project Structure
```
backend/
 ├── src/
 │   ├── auth/
 │   ├── users/
 │   ├── customers/
 │   ├── tasks/
 │   ├── prisma/
 │   └── main.ts
 ├── prisma/
 │   └── schema.prisma
 ├── generated/
 ├── .env
 └── package.json
```

## Architecture Notes

* Controllers → Handle HTTP requests
* Services → Business logic
* DTOs → Validation layer
* Guards → JWT & Role protection
* Prisma Service → Database access
