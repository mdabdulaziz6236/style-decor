# 🏡 StyleDecor - Smart Home & Ceremony Decoration Booking System

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

## 📋 Project Purpose
**StyleDecor** is a modern appointment management system designed for a local decoration company. It bridges the gap between customers seeking aesthetic enhancements for their homes or ceremonies and professional decorators. 

The system solves common industry problems like walk-in crowds and scheduling conflicts by offering online booking, real-time availability checks, secure payments, and a workflow for tracking on-site decoration services from "Planning" to "Completion."

## 🔗 Live Links
- **Live Client URL:** [https://react-firebase-auth-60460.web.app](https://react-firebase-auth-60460.web.app)
- **Server API URL:** [https://style-dec-server.vercel.app](https://style-dec-server.vercel.app)

---

## 🔐 Admin Credentials (For Testing)
*Use these credentials to access the Admin Dashboard functionalities.*

> **Email:** admin123@gmail.com  
> **Password:** Admin@123

---

## 📸 Project Screenshots

<details>
  <summary><b>🏠 Click here to see Full Home Page</b></summary>
  <br>
  <img src="https://github.com/user-attachments/assets/1191d60a-0738-428d-b53f-b98e50fe1833" alt="Home Page Screenshot" width="100%">
</details>

<details>
  <summary><b>🗺️ Click here to see Coverage Page</b></summary>
  <br>
  <img src="https://github.com/user-attachments/assets/0165d6db-00da-46c5-a2e9-592fdfc86086" alt="Coverage Page Screenshot" width="100%">
</details>

<details>
  <summary><b>ℹ️ Click here to see About Page</b></summary>
  <br>
  <img src="https://github.com/user-attachments/assets/6b4dd6d8-5ee3-4ea9-8724-5d341a33dd67" alt="About Page Screenshot" width="100%">
</details>

<details>
  <summary><b>🎨 Click here to see Decorator Dashboard Page</b></summary>
  <br>
  <img src="https://github.com/user-attachments/assets/b9dff509-cbb3-4d62-a165-3e9f930fce83" alt="Decorator Dashboard Screenshot" width="100%">
</details>

<details>
  <summary><b>📊 Click here to see Admin Dashboard Page</b></summary>
  <br>
  <img src="https://github.com/user-attachments/assets/11fd81a7-26d8-46a8-84a3-1bdd6d9b3f81" alt="Admin Dashboard Screenshot" width="100%">
</details>

---

## ✨ Key Features

### 👤 User Features
- **Authentication:** Secure Login/Register via Email & Password or Social Login (Google).
- **Service Browsing:** Search and filter decoration services by type and budget.
- **Booking System:** Book consultations or on-site services with preferred dates.
- **Payment Integration:** Secure payments via **Stripe**.
- **Dashboard:** View booking history, cancel appointments, and download payment receipts (PDF).
- **Service Tracking:** Real-time status updates (e.g., Materials Prepared, On the Way).

### 🎨 Decorator Features
- **Project Management:** View assigned projects and daily schedules.
- **Workflow Control:** Update project status (Planning → Working → Completed).
- **Earnings:** View total earnings summary.

### 🛡️ Admin Features
- **Dashboard & Analytics:** Visual charts (Recharts) for service demand and revenue monitoring.
- **User Management:** Make users Decorators or Admins; approve/disable decorator accounts.
- **Service Management:** CRUD operations for services and packages.
- **Task Assignment:** Assign specific decorators to paid on-site services.

---

## 🛠️ Technology Stack

- **Frontend:** React.js, Tailwind CSS, DaisyUI
- **Backend:** Node.js, Express.js (MERN Stack)
- **Database:** MongoDB
- **Authentication:** Firebase Auth, JWT (JSON Web Tokens)
- **Payment Gateway:** Stripe
- **Deployment:** Vercel / Firebase

---

## 📦 NPM Packages Used (Client Side)

Below is the list of major dependencies used in this project and their purpose:

| Package | Purpose |
| :--- | :--- |
| **@tanstack/react-query** | Efficient server state management, caching, and data fetching. |
| **axios** | Handling HTTP requests to the backend server. |
| **firebase** | User authentication (Login, Register, Social Auth). |
| **react-hook-form** | Efficient and easy form validation and handling. |
| **react-router** | Client-side routing for seamless page navigation. |
| **framer-motion** | Creating smooth animations for the Hero section and UI elements. |
| **recharts** | Visualizing data (histograms, pie charts) in the Admin Dashboard. |
| **swiper** | Creating responsive carousels for testimonials and service showcases. |
| **react-leaflet** | Displaying the interactive Service Coverage Map. |
| **stripe** *(implied)* | Handling secure payment transactions. |
| **jspdf & jspdf-autotable** | Generating downloadable PDF payment receipts for users. |
| **sweetalert2** | Beautiful popup notifications for success/error messages. |
| **react-parallax-tilt** | Adding 3D tilt effects to service cards. |
| **react-phone-input-2** | Handling international phone number inputs. |
| **lucide-react & react-icons**| Providing a vast library of modern icons. |
| **tailwindcss & daisyui** | Rapid UI development with utility classes and pre-built components. |

---

## ⚙️ Environment Variables (Client)

To run this project locally, you must create a `.env.local` file in the root directory and add the following keys:

```env
# Firebase Configuration
VITE_APIKEY=your_firebase_api_key
VITE_AUTHDOMAIN=your_firebase_auth_domain
VITE_PROJECTID=your_firebase_project_id
VITE_STORAGEBUCKET=your_firebase_storage_bucket
VITE_MESSAGINGSENDERID=your_firebase_messaging_sender_id
VITE_APPID=your_firebase_app_id

# Backend URL
VITE_API_URL=[https://style-dec-server.vercel.app](https://style-dec-server.vercel.app)

# Stripe Key
VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key

# Image Hosting (ImageBB/Cloudinary)
VITE_IMAGE_HOSTING_KEY=your_image_upload_api_key