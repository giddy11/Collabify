---

# Collabify

Collabify is a collaborative learning platform designed to enhance peer-to-peer mentorship and project-based collaboration for learners. The platform streamlines onboarding, facilitates connections across locations, and provides an admin panel for managing learner accounts.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Deployment](#deployment)

---

## Features

1. **Onboarding Page**: Allows learners to view introductory information and guidelines. (COMPLETED)
2. **Peer-to-Peer Mentorship**: Assigns learners to mentor others for enhanced learning.
3. **Collaboration Search**: Enables searching for learners outside the location to collaborate on projects.
4. **Admin User Management**: Admins can create accounts for learners.
5. **Change Password**: Learners can update their passwords securely.
6. **Forgot Password**: Provides a recovery option for forgotten passwords.

---

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT, bcrypt, cookies

---

## Getting Started

Follow these instructions to get a copy of TaskMaster up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v14+)
- [MongoDB](https://www.mongodb.com/) (Local or MongoDB Atlas for remote)

### Installation

1. Clone the repository and run the backend server:
    ```bash
    git clone [https://github.com/giddy11/Collabify.git]
    cd backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```
3. Start server:
    ```bash
    node ./index.js
    ```

3. Create a `.env` file in the root directory of the backend and configure the necessary environment variables (see below).

### Environment Variables

Set up the following variables in your `.env` file:

```plaintext
PORT=4001
DATABASE_URL=<Your MongoDB URI>
TOKEN_SECRET_KEY=<Your token secret key>
REFRESH_TOKEN_SECRET_KEY=<Your refresh token secret key>
EMAIL_USER=<your email>
EMAIL_PASS=<your email password>
```

---

## API Endpoints

### User Authentication

- **POST** `/users/signup` - Register a new user
- **POST** `/users/login` - Login with existing credentials
- **POST** `/users/login` - Login with existing credentials
- **POST** `/users/forgot-password` - Send a default password to the user’s email for resetting
- **POST** `/users/change-password` - Change the current password to a new one
- **POST** `/users/logout` - Log out and clear authentication cookies
- **POST** `/users/google-login` - Login using Google authentication
- **POST** `/users/refresh-token` - Refresh the access token using a refresh token

### User Management

- **POST** `/users/create` - Create a new user
- **GET** `/users` - Retrieve all users
- **GET** `/users/:id` - Retrieve a user by their ID
- **PUT** `/users/:id` - Update user details by ID
- **DELETE** `/users/:id` - Delete a user by ID

### User Management

- **POST** `/onboarding/create` - Create a new onboarding
- **GET** `/onboardings` - Retrieve all onboardings
- **GET** `/onboarding/:id` - Retrieve a onboarding by their ID
- **PUT** `/onboarding/:id` - Update onboarding details by ID
- **DELETE** `/onboarding/:id` - Delete a onboarding by ID

#### Request and Response Examples

- **Create a Onboarding**:
    - **POST** `/onboarding`
    - **Body**:
      ```json
      {
        "name": "Week 1",
        "department": "Engineering",
        "topic": "Software Design",
        "noOfAcceptance": 3,
        "link": "http://example.com"
      }
      ```
---

## Usage

### Run the Application

To run the application locally:

1. create a new terminal while the other one for the backend is still running

2.
  ```bash
  npm start
  ```

The server will start on `http://localhost:3000` (or the port you set in `.env`).

## Deployment

### Deploying on Vercel

1. Push your code to GitHub or another repository.
2. Connect your repository to Vercel and configure environment variables.
3. Deploy the application via Vercel.

### Deploying on Render, visit https://render.com/


## Acknowledgments

- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [JWT](https://jwt.io/)

---

Happy Collaboration!
