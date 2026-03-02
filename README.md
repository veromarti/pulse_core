CRUDZASO – PulseCore

## Objective
PulseCore is a platform to manage donors, campaigns, appointments, and support tickets.  
The goal of this project is to demonstrate a **full-stack system** combining SQL (for structured relational data) and MongoDB (for support tickets), with role-based authentication and distinct dashboards per user role.

## Features

### Authentication & Roles
- Login using email and password
- JWT-based session management
- Three roles with specific permissions:
  - **ADMIN**: View all, create campaigns, view tickets
  - **AGENT**: View tickets, update ticket status
  - **USER**: View own information, create tickets (not implemented yet)
- Role-based UI: separate views for ADMIN, AGENT, USER

### SQL (MySQL)
- Users and roles
- Campaigns
- Appointments
- Relationships normalized to at least 3NF
- SQL scripts provided to create tables, PK/FK, and sample data

### NoSQL (MongoDB)
- Tickets collection
- Ticket model includes:
  - Status
  - Category
  - Priority
  - Event history
  - Messages
  - Related SQL entities (appointment, notification)
- Embedded events for history
- Referenced relations for SQL entities

### Endpoints
- **Authentication**
  - `POST /login`
  - `POST /register` (not implemented yet)
- **SQL endpoints**
  - `GET /users`
  - `GET /campaigns`
  - `GET /appointments`
  - `POST /appointments`
- **MongoDB endpoints**
  - `GET /tickets`
  - `GET /tickets/:id`
  - `POST /tickets`
  - `PATCH /tickets/:id/status`
- **Hybrid endpoint**
  - `GET /tickets/:id/related` → combines MongoDB and SQL data

### Frontend
- HTML, CSS, Vanilla JS
- Fetch API for consuming backend endpoints
- Dashboard views per role
- Admin: view/create campaigns
- Agent: view/change ticket status
- Login page with validation
- Token-based authorization for API calls

## Technical Stack
- **Backend**: Node.js, Express
- **Database**: MySQL (via `mysql2`), MongoDB (via `mongodb`)
- **Other dependencies**: CORS, JSON Web Token, bcrypt, csvtojson

## How to Run

1. **Clone the repository**
```bash
git clone <repo-url>
cd pulse_core

2. **Install dependencies**
```bash
npm install

3. **Configure databases**

- MySQL: create database and tables using script.sql
- MongoDB: ensure tickets collection is created; you can migrate from CSV using migrate.js
- Update database connection strings in config/mysql.js and config/mongodb.js

4. **Run the server**
```bash
node src/server.js

Server runs at http://localhost:1115/

5. **Access frontend**

- Open public/index.html in your browser
- Login with a valid user (role-based)

