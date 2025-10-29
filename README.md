# Kanban Project Management Application

A full-stack, real-time collaborative project management application built with Next.js, Node.js, MongoDB, and Socket.IO.

> **DISCLAIMER**: This project was created as an assignment/demonstration project. It is not intended for commercial use or as a profitable product. Use at your own risk in production environments.

## Live Deployment

- **Frontend**: [https://assignment-kanban-eosin.vercel.app/](https://assignment-kanban-eosin.vercel.app/)
- **Backend API**: [https://assignment-kanban.onrender.com/](https://assignment-kanban.onrender.com/)

### Test Accounts

For testing purposes, you can use any of these pre-created accounts:

| Name | Email | Password |
|------|-------|----------|
| Rahul Sharma | rahul.sharma@example.com | Test123 |
| Priya Patel | priya.patel@example.com | Test123 |
| Amit Kumar | amit.kumar@example.com | Test123 |
| Sneha Reddy | sneha.reddy@example.com | Test123 |
| Arjun Singh | arjun.singh@example.com | Test123 |

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Running the Application](#running-the-application)
- [Current Limitations & Assumptions](#current-limitations--assumptions)
- [Performance Considerations](#performance-considerations)
- [Future Scope](#future-scope)

---

## Features

### Core Functionality
- **User Authentication**: Secure signup/login with JWT tokens
- **Project Management**: Create, update, and delete projects
- **Team Collaboration**: Add multiple members to projects
- **Task Management**: Create, assign, update, and delete tasks
- **Kanban Board**: Drag-and-drop interface with three columns (To Do, In Progress, Completed)
- **Real-time Updates**: Live synchronization across multiple users using WebSocket
- **Progress Tracking**: Automatic calculation of project completion percentage
- **Responsive Design**: Fully responsive UI for mobile, tablet, and desktop

### Security Features
- JWT-based authentication
- Protected API routes
- Authorization checks for project and task access
- Email validation (lowercase enforcement)

### User Experience
- Toast notifications for all actions in task like edit , delete and creation only
- Loading states and spinners
- Error handling with user-friendly messages
- Auto-dismiss notifications
- Smooth drag-and-drop interactions

---

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript/React
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with shadcn/ui
- **Form Handling**: React Hook Form
- **Drag & Drop**: @hello-pangea/dnd
- **Real-time**: Socket.IO Client
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: Zod
- **Real-time**: Socket.IO
- **CORS**: cors middleware

### DevOps & Deployment
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway
- **Database**: MongoDB Atlas
- **Package Manager**: pnpm
- **Version Control**: Git/GitHub

---



---

## Setup & Installation

### Prerequisites
- **Node.js**: v18 or higher
- **pnpm**: v8 or higher (Install: `npm install -g pnpm`)
- **MongoDB**: Atlas account or local MongoDB instance

### Step 1: Clone the Repository
```bash
git clone https://github.com/a-s-t-e-y-a/assignment-kanban.git
cd assignment-kanban
```

### Step 2: Install Dependencies
First, install root dependencies (including concurrently):
```bash
pnpm install
```

Then install client & server dependencies:
```bash
pnpm install:all
```

Or run the complete setup command:
```bash
pnpm setup
```

Or install separately:
```bash
pnpm install:client
pnpm install:server
```

### Step 3: Configure Environment Variables

#### Client (.env in `client/` directory)
```env
NEXT_PUBLIC_DEV_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_PROD_BACKEND_URL=https://assignment-kanban-production.up.railway.app/
NEXT_PUBLIC_DEV=true
```

#### Server (.env in `server/` directory)
```env
DATABASE_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/kanban
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
CLIENT_DEV_URL=http://localhost:3000
CLIENT_PROD_URL=https://assignment-kanban-eosin.vercel.app/
DEV=true
```

---

## Running the Application

### Development Mode (Recommended)

**Run both client and server together:**
```bash
pnpm dev
```

This starts:
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

**Run individually:**
```bash
pnpm dev:client    # Frontend only
pnpm dev:server    # Backend only
```

### Production Mode

**Build the client:**
```bash
pnpm build
```

**Run in production:**
```bash
pnpm start
```

### Other Commands

**Clean all dependencies and builds:**
```bash
pnpm clean
```

---

## Current Limitations & Assumptions

### 1. Member Invitation System
**Current Implementation**: To add a new member to a project, the user must first create a new account via the signup page.

**Reason**: Due to time constraints, a full email invitation system with token-based authentication has not been implemented.

**Planned Solution**: Implement an invite system where:
- Project owners can send email invites with unique tokens
- Recipients receive emails with invitation links
- Users can accept invitations without existing accounts
- Token-based verification for secure onboarding

### 2. Real-time Communication Metadata
**Current Implementation**: WebSocket events only broadcast that an action occurred (task created/updated/deleted) without detailed metadata.

**Limitation**: The notification doesn't show:
- Which user performed the action
- Timestamp of the action
- Specific changes made (diff)

**Reason**: Simplified implementation due to time constraints.

**Planned Solution**: Include metadata in socket events:
```javascript
{
  action: 'task_updated',
  user: { name: 'John Doe', email: 'john@example.com' },
  timestamp: '2025-10-29T10:30:00Z',
  changes: { title: 'Old Title' → 'New Title' }
}
```

---

## Performance Considerations

### Responsive Design
**Implemented**: The UI is fully responsive and works seamlessly across:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktops (1024px+)

### Current Performance Limitations

#### 1. **No Server-Side Caching**
- Every API request hits the database directly
- No Redis or in-memory cache implemented
- Can cause slower response times under load

#### 2. **No Rate Limiting**
- API endpoints are not rate-limited
- Vulnerable to abuse and DDoS attacks
- Could impact server performance

#### 3. **Database Query Optimization**
- Basic Mongoose queries without aggregation pipelines
- No indexing strategy documented
- Could be optimized for large datasets


### Solutions with Redis

**Redis could be implemented for**:
1. **Session Caching**: Store user sessions instead of database lookups
2. **API Response Caching**: Cache frequently accessed data (projects, tasks)
3. **Rate Limiting**: Track request counts per user/IP
4. **Job Queues**: Handle background tasks (email notifications, etc.)
5. **Real-time Pub/Sub**: Scale WebSocket across multiple server instances

---

## Future Scope


1. **Email OTP Verification** - Verify user email during signup
2. **Forgot Password** - Password reset via email
3. **Email-based Member Invitations** - Send invite links to new members
4. **Rate Limiting** - Implement Redis-based rate limiting
5. **Server-Side Caching** - Redis caching for API responses


## Known Issues

1. **Postman Collection**: Outdated - some endpoints may not match current API
2. **Concurrent Edits**: Last write wins (no optimistic locking)
3. **Toast Positioning**: May overlap in rare cases with multiple notifications
4. **WebSocket Reconnection**: May require page refresh in some network conditions

---

## Testing

**Manual Testing Guide**: Refer to the testing documentation provided separately for comprehensive test cases covering:
- Authentication flows
- Project management
- Task operations
- Real-time collaboration
- Error handling
- Edge cases

---

## Author

**GitHub**: [@a-s-t-e-y-a](https://github.com/a-s-t-e-y-a)


---

**Note**: This is an assignment/demonstration project. It should not be used as-is for commercial or profitable ventures without significant enhancements, security audits, and proper testing.


