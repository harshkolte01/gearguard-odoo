# GearGuard Frontend 🛠️

Modern, intuitive maintenance management system built with Next.js and React.

## 🎯 What It Does

GearGuard is a comprehensive equipment maintenance management system that helps organizations:

- **Track Equipment** - Monitor all your equipment and categorize them efficiently
- **Manage Maintenance Requests** - Create, assign, and track maintenance work orders
- **Coordinate Teams** - Assign technicians and manage workload across teams
- **Visualize Progress** - Interactive dashboards with real-time KPIs and charts
- **Schedule Work** - Calendar view for planning and tracking scheduled maintenance
- **Generate Reports** - Analyze maintenance data by category, team, and time period

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Note:** Backend server must be running on `http://localhost:3001`

## 🏗️ Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Full type safety
- **Tailwind CSS 4** - Modern utility-first styling
- **Recharts** - Data visualization
- **DnD Kit** - Drag-and-drop for Kanban boards

## 📱 Key Features

### 🔐 Authentication System
- Role-based access control (Admin, Technician, Portal User)
- Secure login/signup with JWT tokens
- Password reset functionality

### 📊 Dashboard
- Real-time KPIs (total requests, in-progress, completed, overdue)
- Advanced filtering (state, priority, technician, date range)
- Interactive request table with status badges
- Role-specific views and permissions

### 📋 Request Management
- Create maintenance requests with equipment selection
- Drag-and-drop Kanban board for visual workflow
- State transitions (New → Assigned → In Progress → Done)
- Assign technicians and teams
- Priority levels (Low, Medium, High, Critical)
- Smart maintenance buttons on equipment

### 🔧 Equipment Management
- Equipment categorization
- Track equipment by work center
- Equipment status monitoring (Running, Under Maintenance, Down, Scrapped)
- Scrap equipment with maintenance impact tracking

### 👥 Team & Technician Management
- Manage work centers and teams
- Assign technicians to teams
- Track technician workload
- Team-based request assignment

### 📅 Calendar View
- Monthly calendar with scheduled maintenance
- Filter by technician or view all schedules
- Visual representation of workload distribution

### 📈 Reports & Analytics
- Requests by category (bar chart)
- Requests by team (pie chart)
- Date range filtering
- Export-ready data visualization

## 📁 Page Structure

```
/login              - User authentication
/admin              - Admin panel (technician & team management)
/equipment          - Equipment list & details
/equipment/categories - Equipment category management
/requests           - Kanban board for maintenance requests
/requests/[id]      - Individual request details
/calendar           - Scheduled maintenance calendar
/reports            - Analytics & data visualization
/teams              - Team management
```

## 🎨 Design Highlights

- **Industrial Minimalism** - Clean, focused interface
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Smooth Animations** - Polished micro-interactions
- **Skeleton Loading** - Beautiful loading states
- **Color-coded Status** - Visual indicators for request states and priorities
- **Accessible UI** - WCAG compliant components

## 👤 User Roles

| Role | Capabilities |
|------|--------------|
| **Admin** | Full system access, manage users, teams, and all requests |
| **Technician** | View assigned requests, update status, complete work |
| **Portal User** | Create requests, view own requests (read-only) |

## 🔧 Environment Setup

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 📦 Build & Deploy

```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Lint
npm run lint
```

## 🎯 For Presentations

**Key Talking Points:**

1. **Complete Solution** - End-to-end maintenance management from request creation to completion
2. **Role-Based Access** - Different views and permissions for admins, technicians, and users
3. **Visual Workflow** - Drag-and-drop Kanban makes task management intuitive
4. **Real-Time Insights** - Dashboard KPIs and reports provide instant visibility
5. **Modern UX** - Clean design with smooth interactions and responsive layout

## 📖 Documentation

- [`QUICK_START.md`](QUICK_START.md) - Get started guide
- [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) - UI components & styling
- [`ROLE_BASED_ACCESS.md`](ROLE_BASED_ACCESS.md) - Permission system
- [`TESTING_GUIDE.md`](TESTING_GUIDE.md) - How to test features

## ✨ Status

✅ **Production Ready** - Fully functional maintenance management system

---

**Built by the GearGuard Team** | Next.js • TypeScript • Tailwind CSS
