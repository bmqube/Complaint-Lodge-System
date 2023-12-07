# Complaint-Lodge-System
Streamline complaint management at North South University with an integrated system, empowering faculty, students, and staff to lodge and review complaints effortlessly.

<br>

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Tech Stack](#tech-stack)
- [Contributing](#contributing)


<br>

## Introduction
The Complaint Lodge System for North South University is designed to handle and organize complaints submitted by various stakeholders, including faculty members, students, teaching assistants, administrators, and other staff members. The system facilitates the review of complaints by faculty members and administrators. Additionally, it includes essential user details such as name, NSU ID, email address, and supplementary information. This standalone product is a novel solution for efficiently managing and addressing concerns within the university community.

<br>

## Features

- User Roles: Distinct roles for faculty members, students, teaching assistants, administrators, and other staff members, each with specific privileges.
- Complaint Submission: A user-friendly interface allowing seamless submission of complaints, with mandatory fields for essential information such as user's name, NSU ID, email address, and additional details.
- Multilingual Speech Recognition: Inclusion of a feature in the Android app enabling users to convert spoken words into text, supporting both Bangla and English languages for enhanced accessibility.
- Review Dashboard: Dedicated dashboards for faculty members and administrators to review and manage complaints, providing a comprehensive overview of pending and resolved issues.
- Notification System: Automatic email notifications to inform users about the status of their lodged complaints, ensuring transparent communication throughout the resolution process.
- Status Tracking: Real-time tracking of complaint status, allowing users to monitor the progress of their lodged complaints.
- User Profile Management: Users can update and manage their profiles, ensuring accurate and up-to-date contact information.
- Audit Trail: A detailed audit trail to track actions taken on each complaint, promoting accountability and transparency.
- Mobile Responsiveness: A responsive design that allows users to access the system from various devices, ensuring flexibility and convenience.
- Integration Capability: Potential for integration with other university systems or databases for seamless information flow and collaboration.

<br>

## Installation
To get started with Complaint-Lodge-System, follow these steps:

1. **Clone the repository:**
   
   ```bash
   git clone https://github.com/bmqube/Complaint-Lodge-System.git
   
2. **Navigate to the client folder (frontend):**
    ```bash
    cd Complaint-Lodge-System/client-web

3. **Install dependencies:**
     ```bash
    npm install

4. **Navigate to the server folder (backend):**
    ```bash
    cd ../server

5. **Install server dependencies:**
    ```bash
    npm install

<br>

## Usage

1. **Run the frontend:**
   
    ```bash
    cd ../client-web
    npm start
    
Open your browser and visit http://localhost:3000 to see the frontend in action.

2. **Run the backend:**

    ```bash
    cd ../server
    npm start
    
Your backend server should be running on http://localhost:8000.

<br>

## Tech Stack
- Frontend: React
- Backend: Express.js
- DBMS: MySQL
- Others: Sequelize as ORM

<br>

## Contributing
We welcome contributions from the community. If you find a bug or have an idea for an enhancement, please open an issue or submit a pull request.
