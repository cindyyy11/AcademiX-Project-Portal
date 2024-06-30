# AcademiX Project Portal

![AcademiX Project Portal](https://example.com/your-screenshot-path/banner.png)

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Configuration](#configuration)
- [Usage](#usage)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Introduction

**AcademiX Project Portal** is a comprehensive management system designed to streamline the administration and tracking of final year projects for students, supervisors, and administrators.

## Features

- Project Enrollment and Management
- Task Assignment and Tracking
- Integrated Calendar
- File Manager for Document Handling
- User Authentication (Google and GitHub)
- Mentor Feedback System
- Real-time Messaging

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed
- MongoDB installed and running
- Git installed
- Visual Studio Code (or any IDE) installed
- Postman installed for API testing

## Installation

### Backend Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/YourUsername/AcademiX-Project-Portal.git
   cd AcademiX-Project-Portal
   
2. **Install Dependencies**
   ```bash
    npm install

3. **Configure Environment Variables**
     Create a .env file in the root directory and add the following variables:
    ```env
    MONGO_URI=mongodb://localhost:27017/academix
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_URL=your_cloudinary_url
    REDIS_URL=your_redis_url

4. **Start MongoDB**
    Make sure your MongoDB server is running:
   ```bash
    mongod

5. **Start the Backend Server**
    ```bash
    npm run dev

# Frontend Setup

1. **Navigate to the Frontend Directory**
    ```bash
    cd frontend

2. **Install Frontend Dependencies**
    ```bash
    npm install

3. **Configure Environment Variables**
    Create a .env file in the frontend directory and add the following variables:
    ```env
    REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
    REACT_APP_GOOGLE_CLIENT_SECRET=your_google_client_secret
    REACT_APP_GITHUB_CLIENT_ID=your_github_client_id
    REACT_APP_GITHUB_CLIENT_SECRET=your_github_client_secret

4. **Start the Frontend Server**
    ```bash
    npm run dev


# Configuration
Ensure your **.env** files are correctly configured with your MongoDB URI, JWT secret, Cloudinary URL, Redis URL, and API credentials for Google and GitHub.

# Usage
- **Students:** Can enroll in projects, manage tasks, and communicate with mentors.
- **Supervisors:** Can oversee student progress, provide feedback, and manage projects.
- **Admins:** Can manage users, projects, and system configurations.
  
# Testing
1. Open Postman
2. Create a New Request to test the API endpoints.
3. Verify Backend Functionality by sending requests and checking the responses.

# Contributing
We welcome contributions! Please read our Contributing Guidelines for more details.

# License
This project is licensed under the MIT License - see the LICENSE file for details.

# Acknowledgements
We would like to express our deepest gratitude to everyone who has contributed to the successful completion of our Final Year Project. This endeavor would not have been possible without the support and assistance of various individuals and organizations.

- Tools and Services: Free access to various tools and services provided by numerous platforms, including Google Drive, Draw.io, Visual Studio Code, GitHub, MongoDB, Postman, Upstack Redis, Cloudinary, Google API, and GitHub API.
- Friends and Relatives: For participating in the User Acceptance Testing (UAT) phase.
- Lecturer: Mr. Justin Gilbert A/L Alexius Silvester for his unwavering guidance, support, and encouragement.
