# 🛠️ GearGuard - Equipment Maintenance Management System

**A modern, full-stack solution for industrial equipment maintenance tracking**

---

## 🎯 What It Does

GearGuard helps organizations manage equipment maintenance efficiently:

- 📋 **Create & Track** maintenance requests
- 🔧 **Assign Technicians** to repair work
- 📊 **Monitor KPIs** with real-time dashboards  
- 📅 **Schedule Work** with calendar view
- 📈 **Generate Reports** on equipment utilization
- 🔐 **Role-Based Access** for different user types

---

## 🏗️ System Architecture

```
┌─────────────────────────────────┐
│   FRONTEND (Port 3000)          │
│   Next.js + React + TypeScript  │
│   ✓ Dashboard & Analytics       │
│   ✓ Kanban Boards               │
│   ✓ Equipment Management        │
│   ✓ Calendar & Reports          │
└────────────┬────────────────────┘
             │ REST API
             │ (HTTP/JSON)
┌────────────▼────────────────────┐
│   BACKEND (Port 3001)           │
│   Node.js + Express + Prisma    │
│   ✓ Authentication (JWT)        │
│   ✓ Business Logic              │
│   ✓ Role-Based Permissions      │
│   ✓ Data Validation             │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│   DATABASE                      │
│   PostgreSQL                    │
│   ✓ Users, Teams, Equipment     │
│   ✓ Maintenance Requests        │
│   ✓ Work Centers, Categories    │
└─────────────────────────────────┘
```

---

## 🎨 Frontend Features

**Tech Stack:** Next.js 16 • TypeScript • Tailwind CSS 4 • Recharts

### Key Features:
- **🔐 Authentication** - Secure login with role-based access
- **📊 Dashboard** - Real-time KPIs with advanced filtering
- **📋 Kanban Board** - Drag-and-drop request management
- **🔧 Equipment Tracking** - Monitor assets and health scores
- **👥 Team Management** - Assign technicians and workload
- **📅 Calendar View** - Visual maintenance scheduling
- **📈 Reports** - Charts and analytics by category/team

### User Roles:
| Role | Access |
|------|--------|
| **Admin** | Full system control, manage users & teams |
| **Technician** | View/update assigned requests |
| **Portal User** | Create requests, view own equipment |

---

## ⚙️ Backend Features

**Tech Stack:** Node.js • Express.js • Prisma ORM • PostgreSQL

### Core APIs:
- **Authentication** - Signup, login, password reset
- **Maintenance Requests** - CRUD + state transitions
- **Equipment Management** - Track assets, warranties, status
- **Team & Technician** - Manage work centers and assignments
- **Dashboard Analytics** - KPIs, metrics, and summaries
- **Reports** - Equipment utilization and history

### Smart Features:
- ✅ **Auto-Assignment** - Requests auto-populate team from equipment
- ✅ **State Workflow** - Enforced transitions (new → in_progress → done)
- ✅ **Role Permissions** - Control who can perform actions
- ✅ **Data Validation** - Ensure data integrity
- ✅ **Error Handling** - Consistent error responses

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Backend Setup
```bash
cd backend
npm install
npm run dev          # Runs on http://localhost:3001
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev          # Runs on http://localhost:3000
```

### Access the App
Open [http://localhost:3000](http://localhost:3000)

**Default Login:**
- Admin: `admin@gearguard.com` / `admin123`
- Technician: `john.tech@gearguard.com` / `tech123`

---

## 📊 Database Schema

**6 Core Tables:**
- `users` - System users with roles
- `teams` - Maintenance teams
- `equipment` - Company assets  
- `maintenance_requests` - Repair tickets
- `work_centers` - Production locations
- `equipment_categories` - Asset classification

---

## 🔄 Maintenance Workflow

```
1. Create Request → User submits maintenance ticket
2. Auto-Fill Team → System assigns team from equipment
3. Assign Technician → Manager assigns specific tech
4. In Progress → Technician starts work
5. Complete → Mark as repaired or scrap
```

---

## 🎯 For Presentations

**Key Highlights:**

1. **Complete Solution** - End-to-end maintenance management
2. **Modern UX** - Clean, intuitive interface with smooth interactions
3. **Role-Based Security** - Different permissions for different users
4. **Real-Time Insights** - Live dashboards and analytics
5. **Production Ready** - Full error handling, validation, and auth

---

## 📦 Tech Stack Summary

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 16, React, TypeScript, Tailwind CSS 4 |
| **Backend** | Node.js, Express.js, Prisma ORM |
| **Database** | PostgreSQL |
| **Auth** | JWT + bcrypt |
| **Validation** | express-validator |
| **Charts** | Recharts |

---

## ✨ Status

✅ **Production Ready**  
✅ Full Authentication & Authorization  
✅ Complete CRUD Operations  
✅ Real-Time Dashboard  
✅ Role-Based Access Control  
✅ Comprehensive API Documentation  

---

**Version:** 1.0.0  
**Built by:** GearGuard Team  
**License:** MIT

