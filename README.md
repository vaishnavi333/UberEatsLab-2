# Uber Eats Project

A full-stack application designed to emulate the core functionalities of Uber Eats. This project includes backend services built with Django REST Framework for API development, MongoDB for the database, and a frontend application developed in React with Redux for state management.

## Table of Contents
- [Overview](url)
- [Features](url)
- [Backend Features](url)
- [Frontend Features](url)
- [Tech Stack](url)
- [Installation](url)
- [Backend Installation](url)
- [Frontend Installation](url)
- [Redux State Management](url)

## Overview
The Uber Eats Clone Project allows users to explore restaurants, place orders, and manage dishes. Restaurants can manage their profile, upload images, and view orders in real-time. The application leverages MongoDB for database management, Django REST Framework for API development, and React with Redux for a responsive and dynamic user experience.

## Features
## Backend Features
- **Authentication:** Secure user login, logout, and signup with token-based authentication.
- **Restaurant Management:** Add, update, and view restaurant details, including opening and closing times.
- **Dish Management:** Perform CRUD operations for dishes with image uploads.
- **Order Management:** Place orders, update statuses, and view order history.
## Frontend Features
- **Responsive Design:** Optimized for various screen sizes using Material-UI and React-Bootstrap.
- **Redux Integration:** Centralized state management for seamless user interactions.
- **Image Uploads:** Preview functionality for restaurant and dish images.
- **Order Tracking:** Real-time order updates and history management.

## Tech Stack
### Backend
- **Framework:** Django, Django REST Framework
- **Database:** MongoDB
### Frontend
- **Library:** React.js
- **State Management:** Redux Toolkit
- **Styling:** Material-UI, React-Bootstrap

## Installation
### Backend Installation
**Clone the Repository:** 
- git clone https://github.com/your-username/uber-eats-clone.git
- cd uber-eats-clone/backend

**Set Up a Virtual Environment:**
- python -m venv venv (python3.10 -m venv venv -- worked for me) 
- source venv/bin/activate  # On Windows: venv\Scripts\activate

**Install Dependencies:**
- pip install -r requirements.txt (navigate to backend folder and download the requirements)

### Configure MongoDB:
- Update settings.py with your MongoDB connection (mentioned in the setting.py)

### **Install MongoDB via MongoDB Installation Guide or using Homebrew:**
- brew install mongodb-community@6.0
### **Start MongoDB:**
- brew services start mongodb/brew/mongodb-community@6.0
### **Access MongoDB shell:**
- mongosh
### **Create a database:**
- use uber_eats (use <database_name> -- which also starts the server)

### **Run Migrations:**
- python manage.py makemigrations
- python manage.py migrate
### **Start the Server:**
- python manage.py runserver

### Frontend Installation
### **Navigate to the Frontend Directory:** 
cd ../frontend
### **Install Dependencies:** 
npm install
### **Start the Development Server:** 
npm start

## Redux State Management
The project uses Redux Toolkit to manage application state. The main slices include:
### **restaurantSlice:** 
Manages restaurant-related state.
### **dishSlice:** 
Handles state for dish operations.
### **orderSlice:** 
Manages orders and order history.

## Usage
### Local Development: 
- Access the frontend at http://localhost:3000 and the backend at http://localhost:8000.
### Admin Access
- Use Django Admin for direct data management, e.g., adding new restaurants or dishes.

## Screenshots
- For Screenshots check out the Results Screenshots file.
