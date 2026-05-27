# AI Disaster Prediction Management System

![Project Status](https://img.shields.io/badge/Status-Active-success)
![Architecture](https://img.shields.io/badge/Architecture-MERN%20%2B%20Python-blue)
![Real-Time](https://img.shields.io/badge/Real--Time-WebSockets-orange)

An advanced, full-stack web application designed to predict natural disasters, manage emergency broadcasts, and monitor global risks in real-time. Built with a Microservice Architecture to handle mathematical modeling separately from the main API.

## 🚀 Features

- **Real-Time Live Map:** Interactive geographic map plotting active danger zones and historical disasters.
- **AI Prediction Engine:** A dedicated Python microservice that analyzes environmental factors (temperature, pressure, humidity, wind) to predict Disaster Probabilities and severity.
- **Admin Command Center:** Secure, role-based dashboard for authorized personnel to monitor real-time system logs and issue manual emergency broadcasts.
- **Live Event Streaming:** Utilizes WebSockets (`Socket.io`) to instantly push alerts and prediction logs to all connected clients without refreshing the page.
- **Authentication:** Secure user login utilizing JSON Web Tokens (JWT) and encrypted passwords.

## 🏗️ System Architecture

This project is built using an impressive multi-tier architecture to demonstrate scalability and separation of concerns:

### 1. Frontend (Client)
- **Tech Stack:** React.js, Tailwind CSS, Vite
- **Details:** A responsive, dark-mode Single Page Application (SPA). Uses `Recharts` for interactive data visualization and `React-Leaflet` for dynamic mapping.

### 2. Backend (Main API Server)
- **Tech Stack:** Node.js, Express.js
- **Details:** A RESTful API that handles user authentication, CRUD operations for alerts and predictions, and WebSocket connections for real-time data streaming.

### 3. Database
- **Tech Stack:** MongoDB, Mongoose (ODM)
- **Details:** A NoSQL database storing user profiles with clearance levels, historical predictions, and active broadcast alerts.

### 4. AI Engine (Microservice)
- **Tech Stack:** Python, Flask
- **Details:** An isolated microservice dedicated to handling mathematical predictions. Instead of a simple database lookup, this service utilizes a **Rule-Based Expert System** to calculate probability thresholds based on real-time meteorological inputs (e.g., wind speed, air pressure, temperature, humidity). This demonstrates an advanced understanding of deterministic algorithm design and Inter-Process Communication between a Node.js API and a Python backend.

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- Python (3.12+)
- MongoDB (Running locally or MongoDB Atlas)

### 1. Backend Setup (Node.js)
```bash
cd backend
npm install
# Create a .env file with PORT=5000 and MONGO_URI
npm start
```

### 2. Frontend Setup (React)
```bash
cd frontend
npm install
npm run dev
```

### 3. ML Service Setup (Python)
```bash
cd ml-service
pip install -r requirements.txt
python main.py
```

## 👨‍💻 Usage
1. Open `http://localhost:5173` in your browser.
2. Login with your secure admin credentials.
3. Use the **AI Prediction** tab to simulate environmental conditions.
4. Watch the **Live Map** and **Dashboard** update instantly via WebSockets!

## 🎓 Academic Highlights
- Implements secure **JWT Authentication**.
- Demonstrates **Microservice Architecture** (Node.js + Python).
- Uses **WebSockets (Socket.io)** for real-time bidirectional communication.
- Features modern **UI/UX** with responsive design and interactive charting.
