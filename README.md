# PG Booking Management System

## About the Project

Finding a suitable PG (Paying Guest) accommodation can be time-consuming for students and working professionals. This project was developed to simplify that process by providing a platform where users can search, view, and book PG accommodations online.

The PG Booking Management System is a full-stack web application that allows users to browse available PGs, view details, make bookings, manage payments, and leave reviews. Property owners can manage their PG listings, while administrators can monitor and manage the overall platform.

This project was built as a learning experience to understand real-world full-stack development concepts such as authentication, role-based access control, REST APIs, database management, and payment integration.

---

## Features

### User Features

* User registration and login
* Secure authentication using JWT
* Browse available PG accommodations
* View PG details and amenities
* Book a room online
* Manage bookings
* Make online payments
* Receive notifications
* Submit ratings and reviews

### Owner Features

* Add new PG listings
* Update PG details
* Manage room availability
* View booking information
* Track revenue and bookings

### Admin Features

* Manage users
* Monitor PG listings
* View platform activities
* Manage bookings and reviews

---

## Technology Stack

### Frontend

* React.js
* JavaScript
* Tailwind CSS
* Axios

### Backend

* Java
* Spring Boot
* Spring Security
* Spring Data JPA
* JWT Authentication

### Database

* MySQL

### Payment Gateway

* Razorpay

### Build Tools

* Maven
* Vite

---

## Project Structure

```text
PG-Booking-main
│
├── pg-backend
│   ├── Controllers
│   ├── Services
│   ├── Repositories
│   ├── Models
│   ├── Security
│   └── Configuration
│
└── pg-frontend
    ├── Components
    ├── Pages
    ├── Context API
    ├── Services
    └── Assets
```

## Database Design

The system uses multiple entities including:

* User
* PG
* Booking
* Bill
* Review
* Notification

Relationships are managed using JPA and MySQL foreign keys.

---

## Authentication and Authorization

The application uses JWT (JSON Web Token) based authentication.

Three roles are supported:

* USER
* OWNER
* ADMIN

Role-based authorization ensures that each user can only access features relevant to their role.

---

## Payment Integration

The project integrates Razorpay for secure online payment processing. Users can make booking payments through the payment gateway, and payment records are stored in the system.

---

## How to Run the Project

### Backend Setup

1. Clone the repository

```bash
git clone <repository-url>
```

2. Navigate to backend folder

```bash
cd pg-backend
```

3. Configure MySQL database in `application.properties`

4. Build and run the application

```bash
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

---

### Frontend Setup

1. Navigate to frontend folder

```bash
cd pg-frontend
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## Learning Outcomes

Through this project, I gained practical experience in:

* Full Stack Web Development
* Spring Boot REST APIs
* JWT Authentication
* Database Design
* React Component Architecture
* State Management
* Payment Gateway Integration
* Role-Based Access Control
* Git and GitHub Version Control

---

## Future Improvements

* Email notifications
* Real-time chat between users and owners
* Advanced search and filtering
* Image upload with cloud storage
* Mobile responsive enhancements
* Analytics dashboard

---

## Author

Lokesh Yewale

Java Full Stack Developer

This project was developed as part of my learning journey in Java Full Stack Development and demonstrates my understanding of backend development, frontend integration, authentication, database management, and payment gateway implementation.
