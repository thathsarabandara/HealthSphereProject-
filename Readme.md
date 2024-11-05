

# 🌐 HealthSphere - Hospital Management System

**HealthSphere** is a comprehensive **Hospital Management System** designed to facilitate smooth interactions between **Patients**, **Doctors**, and **Admins**. Built using the **MERN (MySQL, Express, React, Node.js)** stack, HealthSphere supports various features like patient management, doctor scheduling, and system administration to streamline healthcare operations.

---

## 📑 Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Setup Instructions](#setup-instructions)
5. [Directory Structure](#directory-structure)
6. [API Endpoints](#api-endpoints)
   - [Patient Routes](#patient-routes)
   - [Doctor Routes](#doctor-routes)
   - [Admin Routes](#admin-routes)
7. [License](#license)
8. [Contributing](#contributing)

---

## 📋 Project Overview

HealthSphere allows **Patients**, **Doctors**, and **Admins** to interact with the system based on role-based permissions. Here’s a quick look at user functionalities:

- 👩‍⚕️ **Patients**: Register, search doctors, book appointments, view prescriptions, and access pharmacy & lab services.
- 👨‍⚕️ **Doctors**: Manage patient profiles, update prescriptions, view schedules, and set up video consultations.
- 👩‍💼 **Admins**: Oversee system operations, manage users, handle financials, and maintain system security.

---

## 🚀 Features

- **Patient Management**: Register, log in, search for doctors by specialization, book appointments, view lab packages, and more.
- **Doctor Management**: Manage patient records, update prescriptions, and organize appointments.
- **Admin Dashboard**: Administer all activities, manage doctors, patients, and handle refunds.
- **Secure Authentication**: JWT-based role-based access control for user sessions.
- **Rate Limiting**: Protects from excessive requests with rate limit middleware.
- **Error Handling**: Custom error pages (404, 403, 429) for better UX.

---

## 🛠 Technologies Used

- **Frontend**: React.js, Redux, Axios
- **Backend**: Node.js, Express.js, MySQL
- **Database**: MySQL
- **Authentication**: JWT
- **APIs**: RESTful API structure
- **Middleware**: Rate limiting, authentication, and role-based access

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/thathsarabandara/HealthSphereProject-.git
```

### 2. Install dependencies

- **Backend**:

  ```bash
  cd server
  npm install
  ```

- **Frontend**:

  ```bash
  cd client
  npm install
  ```

### 3. Configure MySQL Database

- Create a MySQL database and update the configuration file with the connection details.

### 4. Run the development servers

- **Backend**:

  ```bash
  npm run dev
  ```

- **Frontend**:

  ```bash
  npm start
  ```

---

## 📂 Directory Structure

### Client - Frontend

```plaintext
client/
├── public/
├── src/
|   ├── assets/            # Assets files related to the project 
│   ├── components/        # Reusable UI components
│   ├── pages/             # Application pages
│   ├── styles/            # Css files   
│   ├── utils/             # Utility functions
│   └── App.js             # Main App component
└── package.json
```

### Server - Backend

```plaintext
server/
├── Assets/                # Assets files
├── config/                # Configuration files
├── controllers/           # Route logic (Patients, Doctors, Admins)
├── middleware/            # Authentication, role-based access
├── models/                # Database models (e.g., User, Prescription)
├── routes/                # API endpoints
├── seeders/               # Seeding files
├── services/              # Services like emails services 
├── utils/                 # Utility functions
├── index.js                 # Main server file
└── package.json
```

---

## 📍 API Endpoints

### 🧑‍⚕️ Patient Routes

| HTTP Method | Endpoint                         | Description                                             | Middleware                |
|-------------|----------------------------------|---------------------------------------------------------|---------------------------|
| **POST**    | `/register`                      | Register a new patient                                  | -                         |
| **POST**    | `/login`                         | Log in and receive JWT token                            | -                         |
| **POST**    | `/logout`                        | Log out of session                                      | -                         |
| **GET**     | `/home`                          | Patient’s home page                                     | `rateLimiterMiddleware`   |
| **GET**     | `/finddoctor`                    | Search for doctors                                      | `rateLimiterMiddleware`   |
| **GET**     | `/finddoctor/:specialization`    | View doctors by specialization                          | `rateLimiterMiddleware`   |
| **GET**     | `/finddoctor/:specialization/reservation` | Reserve appointment with specialist   | `authMiddleware`, `authorizeRole('user')` |
| **GET**     | `/package`                       | View available healthcare packages                      | `authMiddleware`, `authorizeRole('user')` |
| **GET**     | `/userprofile`                   | Access user profile                                     | `authMiddleware`, `authorizeRole('user')` |
| **POST**    | `/resetpasswordRequest`          | Request password reset                                  | -                         |
| **POST**    | `/resetpassword`                 | Reset password using token                              | -                         |

### 👨‍⚕️ Doctor Routes

| HTTP Method | Endpoint                    | Description                                    | Middleware                  |
|-------------|-----------------------------|------------------------------------------------|-----------------------------|
| **GET**     | `/doctor`                   | Doctor list                                    | -                           |
| **GET**     | `/doctor/home`              | Doctor's home dashboard                        | `authMiddleware`            |
| **GET**     | `/doctor/schedule`          | Manage doctor schedules                        | `authMiddleware`            |
| **GET**     | `/doctor/clinic`            | Access clinic tools                            | `authMiddleware`            |
| **GET**     | `/doctor/clinic/prescription` | Manage patient prescriptions                  | `authMiddleware`            |
| **GET**     | `/doctor/videoconsultation` | Access video consultations                     | `authMiddleware`            |

### 👩‍💼 Admin Routes

| HTTP Method | Endpoint              | Description                                | Middleware                   |
|-------------|-----------------------|--------------------------------------------|------------------------------|
| **GET**     | `/admin`              | Admin home                                 | `authMiddleware`             |
| **GET**     | `/admin/dashboard`    | View dashboard summary for admins          | `authMiddleware`             |
| **GET**     | `/admin/managedoctors`| Manage doctor accounts                     | `authMiddleware`, `authorizeRole('admin')` |
| **GET**     | `/admin/managepatient`| Manage patient accounts                    | `authMiddleware`, `authorizeRole('admin')` |
| **GET**     | `/admin/refund`       | Process refund requests                    | `authMiddleware`, `authorizeRole('admin')` |

---

## 📜 License

All Rights Reserved  2024 - @Dev-Squad<sup>TM</sup>


## 🤝 Contributing

1. **👨‍💼 Nuhansa Kodithuwakku** - **📝 Project Manager**
2. **🎨 Vidusahan Perera** - **🎨 Designer**
3. **💻 Nathasha Florin** - **💻 FrontEnd Developer**
4. **🌪️ Thathsara Bandara** - **🔧 Backend Developer**
5. **🔧 Ashinsana Weerakon** - **🔧 Backend Developer**
6. **💾 Thusharangi Fernando** - **💾 Database Administrator**
7. **🧪 Belani Jayasinghe** - **🧪 Tester**

---

