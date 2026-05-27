# AI Disaster Prediction & Management System

![AI Disaster Prediction](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue)
![NodeJS](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green)
![Python](https://img.shields.io/badge/ML%20Engine-Python%20%2B%20Flask-yellow)

A real-time, production-level web application designed to monitor, predict, and manage natural disasters using Machine Learning and geospatial data. Features a highly interactive, responsive Cyberpunk-themed UI with both Dark and Light modes.

## 🌟 Key Features

### 🛡️ Role-Based Access Control (RBAC)
- **Admin Dashboard**: Full access to global disaster analytics, prediction triggers, and user management.
- **Client Dashboard**: Public-facing portal to view live alerts, nearest shelters, and regional disaster history.
- Secure JWT-based authentication.

### 🗺️ Live Geospatial Monitoring
- Interactive **Leaflet** map integration.
- Real-time plotting of active disaster zones (Floods, Wildfires, Earthquakes, Cyclones) with heatmaps and severity markers.

### 📊 Real-Time Analytics & Data Visualization
- Powered by **Recharts**.
- Dynamic **Prediction Trends** (Line Charts).
- **Disaster Distribution** (Pie Charts).
- **Risk by Region** (Bar Charts).
- **AI Model Performance Accuracy** metrics.

### 🤖 Machine Learning Integration
- Python (Flask) microservice backend for AI predictions.
- Simulates advanced environmental data processing (Temperature, Humidity, Wind Speed, Soil Moisture) to calculate disaster probabilities.

### 🚨 Emergency Response Tools
- **Live Alerts Feed**: Rolling updates on critical environmental thresholds.
- **Shelters Database**: Searchable grid of safe zones and evacuation centers.
- **Disaster History**: Track active/resolved events and export CSV aftermath reports.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (via Vite for lightning-fast HMR)
- **Tailwind CSS** (for fully responsive, utility-first styling)
- **React Router** (Client-side routing)
- **Recharts** (SVG data visualization)
- **Lucide React** (Modern iconography)
- **Leaflet & React-Leaflet** (Interactive maps)

### Backend (Node.js API)
- **Express.js** (REST API framework)
- **MongoDB & Mongoose** (NoSQL Database for Users and Disaster Records)
- **JSON Web Tokens (JWT)** (Authentication)
- **Bcrypt.js** (Password hashing)

### Machine Learning (Python API)
- **Flask** (Lightweight Python server)
- **Scikit-Learn** (Random Forest Regressor for prediction modeling)
- **Pandas / NumPy** (Data processing)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.9+)
- MongoDB instance (Local or Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/vvaishnavisundar-ai/AI--DISASTER-PREDICTION-MANANGEMNET-SYSTEM.git
cd "AI--DISASTER-PREDICTION-MANANGEMNET-SYSTEM"
```

### 2. Setup Node.js Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
ML_API_URL=http://localhost:5001
```
Start the server:
```bash
npm run dev
```

### 3. Setup Python ML Backend
Open a new terminal and navigate to the `ml_backend` folder:
```bash
cd ml_backend
pip install -r requirements.txt
```
Start the Flask server:
```bash
python main.py
```
*(The ML server runs on port 5001 by default).*

### 4. Setup React Frontend
Open a new terminal and navigate to the `frontend` folder:
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000
```
Start the Vite development server:
```bash
npm run dev
```

---

## 📱 Mobile Responsiveness
The UI has been rigorously tested and optimized for mobile devices. It features:
- Fluid flexbox layouts that prevent chart overlapping.
- Custom horizontal scrolling tables to prevent data truncation.
- Protected `overflow` bounds to ensure smooth native scrolling.

## 🎨 Theming
The application supports persistent **Dark Mode** and **Light Mode** configurations via CSS variables, heavily prioritizing a sleek, high-contrast, professional "Cyberpunk" aesthetic.

## 📄 License
This project is proprietary and developed as part of a specialized portfolio. All rights reserved.
