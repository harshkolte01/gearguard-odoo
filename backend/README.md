# 🛠️ GearGuard Backend

**Enterprise Maintenance Management System API**

Built with **Node.js + Express + PostgreSQL + Prisma**

---

## 🚀 Quick Start

```bash
npm install          # Install dependencies
npm run dev          # Start server on http://localhost:3001
```

---

## 📊 What It Does

GearGuard backend manages **industrial equipment maintenance** with:

- **Authentication** - Secure JWT-based login with role management
- **Equipment Tracking** - Monitor assets, warranties, and health scores
- **Maintenance Requests** - Create, assign, and track repair workflows
- **Team Management** - Organize technicians and assignments
- **Work Centers** - Manage production locations
- **Dashboard Analytics** - Real-time KPIs and metrics
- **Reports** - Equipment utilization and maintenance history

---

## 🗄️ Database

**6 Core Tables:**
- `users` - System users with role-based access
- `teams` - Maintenance teams
- `equipment` - Company assets
- `maintenance_requests` - Repair tickets
- `work_centers` - Production locations
- `equipment_categories` - Asset classification

**Tech:** PostgreSQL with Prisma ORM

---

## 🔐 Roles & Permissions

| Role | Access |
|------|--------|
| **Admin** | Full system control |
| **Manager** | Manage teams, equipment, assign work |
| **Technician** | Execute maintenance, update status |
| **Portal** | Create requests, view own equipment |

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login
- `POST /api/auth/forgot-password` - Reset password

### Dashboard
- `GET /api/dashboard/summary` - KPI overview
- `GET /api/dashboard/recent-requests` - Latest requests
- `GET /api/dashboard/technician-status` - Team workload

### Maintenance Requests
- `GET /api/maintenance-requests` - List all (with filters)
- `POST /api/maintenance-requests` - Create request
- `PUT /api/maintenance-requests/:id` - Update request
- `POST /api/maintenance-requests/:id/assign` - Assign technician
- `POST /api/maintenance-requests/:id/transition` - Change state

### Equipment
- `GET /api/equipment` - List equipment
- `POST /api/equipment` - Add equipment
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Remove equipment

### Teams
- `GET /api/teams` - List teams
- `POST /api/teams` - Create team
- `POST /api/teams/:id/members` - Add member

### Reports
- `GET /api/reports/equipment` - Equipment utilization
- `GET /api/reports/maintenance` - Maintenance history

---

## 📈 Key Features

✅ **Smart Auto-Assignment** - Requests auto-populate team from equipment  
✅ **State Transitions** - Enforced workflow (new → in_progress → repaired/scrap)  
✅ **Role-Based Actions** - Permissions control who can do what  
✅ **Data Validation** - Express-validator ensures data integrity  
✅ **Error Handling** - Consistent error responses across all endpoints  
✅ **CORS Enabled** - Frontend communication configured  

---

## 🏗️ Architecture

```
┌─────────────┐
│  Frontend   │
└──────┬──────┘
       │ HTTP/JSON
┌──────▼──────────────┐
│   Express Router    │  ← Routes & Middleware
├─────────────────────┤
│   Controllers       │  ← Business Logic
├─────────────────────┤
│    Services         │  ← Data Operations
├─────────────────────┤
│  Prisma ORM         │  ← Database Layer
└──────┬──────────────┘
       │
┌──────▼──────┐
│ PostgreSQL  │  ← Data Storage
└─────────────┘
```

---

## 🔧 Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** JWT + bcrypt
- **Validation:** express-validator

---

## 📦 Scripts

```bash
npm run dev              # Start development server
npm run seed             # Populate database with sample data
npm run check-db         # Verify database connection
npm run prisma:studio    # Open database browser
npm run prisma:push      # Sync schema to database
```

---

## 🎯 Maintenance Workflow

1. **Create Request** → Any user creates a maintenance ticket
2. **Auto-Fill Team** → System assigns team from equipment
3. **Assign Technician** → Manager assigns to specific tech
4. **Work In Progress** → Technician starts work
5. **Complete** → Mark as repaired or scrap

---

## 🔥 Core Business Logic

### Request States
- `new` - Just created, awaiting assignment
- `in_progress` - Being worked on
- `repaired` - Fixed successfully
- `scrap` - Equipment beyond repair

### Request Types
- `corrective` - Unplanned breakdown repairs
- `preventive` - Scheduled routine maintenance

### Equipment Status
- `active` - In operation
- `scrapped` - Out of service

---

## 📁 Project Structure

```
backend/
├── app.js                 # Express app setup
├── server.js              # Server entry point
├── routes/                # API endpoints
├── controllers/           # Request handlers
├── services/              # Business logic
├── middleware/            # Auth, validation, RBAC
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.js           # Sample data
└── utils/                # Validators & helpers
```

---

## 🌟 Production Ready

✅ Environment configuration  
✅ Database migrations  
✅ Error handling  
✅ Input validation  
✅ Secure authentication  
✅ Role-based access control  
✅ API documentation  

---

**Status:** Production Ready  
**Version:** 1.0.0  
**Port:** 3001
