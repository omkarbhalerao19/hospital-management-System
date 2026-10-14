# &#x20;MediCore | Hospital Management System

**A Full-Stack Web Application for Hospital Operations and Patient Services**

MediCore is a web-based hospital management system developed using Node.js and MongoDB. It provides patient authentication, OPD appointment management, and community health discussions through a centralized platform.

---

## 01. Project Overview

### Core Features

- **Patient Authentication** — Patient registration and login.
- **OPD Management** — Appointment creation and retrieval.
- **Community Health** — Health-related discussions and post resolution.
- **Patient Dashboard** — Centralized interface for accessing application features.
- **Cloud Database** — MongoDB Atlas integration for persistent data storage.

## 02. Technology Stack

| Component        | Technology              |
| ---------------- | ----------------------- |
| Frontend         | HTML5, CSS3, JavaScript |
| Backend          | Node.js, Express.js     |
| Database         | MongoDB Atlas           |
| ODM              | Mongoose                |
| Password Hashing | bcryptjs                |
| Configuration    | dotenv                  |

## 03. System Architecture

```text
Client Interface
      │
      ▼
HTML · CSS · JavaScript
      │
      ▼
Express.js REST API
      │
      ▼
Mongoose ODM
      │
      ▼
MongoDB Atlas
```

## 04. API Reference

| Method     | Endpoint                     | Description                        |
| ---------- | ---------------------------- | ---------------------------------- |
| POST       | `/api/auth/register`         | Register a patient                 |
| POST       | `/api/auth/login`            | Authenticate a patient             |
| GET / POST | `/api/appointments`          | Retrieve or create appointments    |
| GET / POST | `/api/community`             | Retrieve or create community posts |
| PATCH      | `/api/community/:id/resolve` | Update post resolution status      |

## 05. Repository Structure

```text
hospital-management/
├── public/
│   ├── css/
│   ├── js/
│   └── *.html
├── server/
│   ├── config/
│   ├── models/
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 06. Installation & Setup

**Requirements:** Node.js, npm, and a MongoDB Atlas connection string.

```bash
git clone https://github.com/omkarbhalerao19/hospital-management.git
cd hospital-management
npm install
```

Create a `.env` file in the project root:

```env
PORT=3000
MONGO_URI=your_mongodb_atlas_connection_string
```

Start the application:

```bash
node server/server.js
```

Access the application at `http://localhost:3000`.

## 07. Security Considerations

The project currently serves as a development and learning application. Before production deployment, it requires token or session-based authentication, API authorization, input validation, and stricter CORS configuration. Do not use real patient data until appropriate security controls are implemented.

## 08. Developer

**Omkar Bhalerao**

GitHub: [omkarbhalerao19](https://github.com/omkarbhalerao19)

**Project Repository:** [Hospital Management System](https://github.com/omkarbhalerao19/hospital-management)

---

*Developed to demonstrate full-stack web development and database integration using Node.js and MongoDB.*
