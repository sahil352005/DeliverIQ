# 🚀 DeliverIQ – Bulk Messaging System

DeliverIQ is a **full-stack bulk messaging system** that enables users to manage contacts, compose messages, and send them in bulk while ensuring delivery tracking. The system is designed for scalability, fault-tolerance, and performance using **Next.js, NestJS, PostgreSQL, Redis, and Prisma ORM**.


<img src="https://github.com/user-attachments/assets/b0c4933c-c4d2-4e95-b220-bd5d39b4b026" width="600" />



---

## 📌 Features

### 🔹 Frontend (Next.js 14+)

* Modern **React-based UI** with **Next.js App Router**.
* Secure **JWT authentication** (Login / Signup).
* Contact management (Add / Edit / Delete).
* Compose and send **bulk messages**.
* View **message status** (Pending, Processing, Sent, Failed).
* Fully responsive with **Tailwind CSS**.

### 🔹 Backend (NestJS + Prisma)

* RESTful API with **NestJS**.
* **PostgreSQL + Prisma** ORM for relational data.
* **BullMQ + Redis** for background job queue & caching.(wire exponential backoff for the queue)
* Authentication & authorization with **JWT**.
* Message processing pipeline with retry mechanism.
* Scalable architecture with **Docker support**.

---

## 🏗️ Tech Stack

* **Frontend**: Next.js 14, React, Tailwind CSS
* **Backend**: NestJS, Prisma ORM, TypeScript
* **Database**: PostgreSQL 15
* **Cache / Queue**: Redis 7
* **Containerization**: Docker & Docker Compose
* **Auth**: JWT-based authentication
* **Package Manager**: npm / yarn / pnpm

---

## 📂 Project Structure

```
DeliverIQ/
│── backend/                  # NestJS backend
│   ├── prisma/               # Prisma schema & migrations
│   ├── src/                  # NestJS modules & controllers
│   ├── .env.example          # Backend environment variables
│   └── README.md             # Backend-specific docs
│
│── frontend/                 # Next.js frontend
│   ├── app/                  # Next.js app router
│   ├── components/           # UI components
│   ├── lib/                  # API helpers & utils
│   ├── .env.example          # Frontend environment variables
│   └── README.md             # Frontend-specific docs
│
│── docker-compose.yml        # Docker services for Postgres & Redis
│── README.md                 # Main documentation
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/sahil352005/DeliverIQ.git
cd deliveriq
```

### 2️⃣ Backend Setup

```bash
cd backend
cp .env.example .env
npm install
```

#### Prisma Setup

```bash
npm run prisma:generate
npm run prisma:migrate
```

#### Run Backend

```bash
npm run start:dev
```

Backend runs on 👉 `http://localhost:3000/api`

---

### 3️⃣ Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
```

#### Run Frontend

```bash
npm run dev
```

Frontend runs on 👉 `http://localhost:3001`

---

### 4️⃣ Docker Services (PostgreSQL + Redis)

At the project root:

```bash
docker compose up -d
```

* PostgreSQL → `localhost:5433`
* Redis → `localhost:6379`

---

## 🔑 Environment Variables

### 📌 Backend – `.env` 

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=deliveriq
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/deliveriq?schema=public"

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

JWT_SECRET=dev_secret
JWT_EXPIRES_IN=1d
```

### 📌 Frontend – `.env`

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=DeliverIQ
```

---

## 🗄️ Database Schema (Prisma)

* **User**: Stores user info and authentication data.
* **Contact**: Manages user-specific contacts.
* **Message**: Tracks bulk messages and their statuses.
* **MessageStatus Enum**: `PENDING | PROCESSING | SENT | FAILED`

---

## 🔄 Message Flow

1. User logs in & adds contacts.
2. User composes a message & sends.
3. Backend pushes the job to **Redis Queue**.
4. Worker processes the job & updates **Postgres** with message status.
5. Frontend fetches & displays status in real-time.

---

## 📊 Future Improvements

* ✅ Real-time updates with WebSockets.
* ✅ Integration with **Twilio / WhatsApp API** for actual delivery.
* ✅ Role-based access (Admin / User).
* ✅ Analytics dashboard for message insights.

---

## 🧑‍💻 Scripts

### Backend

* `npm run start:dev` → Start dev server
* `npm run prisma:studio` → Open Prisma Studio
* `npm run prisma:migrate` → Run migrations

### Frontend

* `npm run dev` → Start dev server
* `npm run build` → Build production app
* `npm run start` → Start production server

---

## 🌍 Deployment

* **Docker Compose** for local setup.
* Deploy on **Vercel** (Frontend) + **Render / Railway** (Backend + DB + Redis).

---
