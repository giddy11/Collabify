Please Note this:
 ![image](https://github.com/user-attachments/assets/ad95d563-dc0f-4481-9851-3dcb2ffa9531)


There will be delay when trying to login or signin because the hosting the hosting platform was inactive for some time. So please kindly be patient while you wait. Thanks
---

Collabify

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
- [Challenges](#challenges)
- [Acknowledgements](#acknowledgements)

---

## Top

## Features

1. **Onboarding Page**: Allows learners to view introductory information and guidelines. (COMPLETED)
2. **Change Password**: Learners can update their passwords securely (COMPLETED).
3. **Forgot Password**: Provides a recovery option for forgotten passwords (COMPLETED).
4. **Authentication**: User registers and login with valid email (COMPLETED).
5. **Profile Page integration**: Functional Profile Page to be dynamic (COMPLETED).
6. **Learners Directory**: Enable Learners to view their directory so as to interact with them (COMPLETED).
7. **Protected Routes**: Making the pages protected for unauthorized users (COMPLETED).
8. **Admin / User View**: Some Views wont be visible by the users (COMPLETED).
9. **Admin User Management**: Admins can create accounts for learners and assign roles (users and roles),  it displays the list of all users and their roles (COMPLETED).

10. **Rigid Security**: Implement basic security features such as input validation and protection against SQL injection or XSS attacks ().
11. **Peer-to-Peer Mentorship**: Assigns learners to mentor others for enhanced learning i.e the Follow up module functionality.
12. **Collaboration Search - Matchmaking**: Enables searching for learners outside the location to collaborate on projects.
13. **A functional Dashboard**: The dashboard will capture data for number of important information to display.
14. **Notification**: Users and admin can have a functional notification for incomings.
15. **Settings**: This can have notifications settings to turn off or on notifications.
16. **Events**: Learners can create events meetings online to explain certain concept.
17. **Groups**: Groups can be created by he admin for the learners.
18. **The Search Feature (Header)**: The feature searches for learners, groups, users, events.
19. **Admin Creates multiple Communities**: So instead of one account for one learning location, we can now have multiple locations for one account as been added to the admin.
20. **Mobile Responsiveness**: It will be responsive across devices.

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

### Challenges

Challenges Faced During Development

1. Encountered significant redundancy with repeated implementations of the header and sidebar components across multiple pages. This made managing the UI flow overly complex and task-intensive. (SOLUTION: To look into frameworks like React that offers reusable componentization)

2. Frontend Update Issue

    During development, we struggled with windows not reloading automatically after updating a field. After troubleshooting, we resolved the issue by using window.location.reload() to refresh the page and reflect the updates.
    Unrestricted Access (CONSIDERATION: UseState effects in React)

3. Currently, there’s a challenge where any user can sign up and gain access to view my works and activities without restrictions. This raises concerns about content privacy and security, and we're working on a solution to enforce proper user access control. (SOLUTION: This was handled after linking a user to the created model).

4. Team member assigned to handle the frontend struggled to consume endpoints from the backend, thereby giving more workloads by the fellow who was handling the backend to also consume endpoints at the frontend. (SOLUTION: Impacting knowledge to the fellow and giving small projects to do that require endpoints consumption).

5. Our greatest challenge was implementing the role. When changing the role of another user, it doesnt persist the role changed. We are Still trying to fix this. (SOLUTION: We had to try other ways and noticed it worked. then we had to figure out why the first way didnt work which now led us to an error on our path ☺)


## Acknowledgements

- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [JWT](https://jwt.io/)

---

[Top](#top)

Use this to login as user becuase automatically when you register, you become an admin.
email: edoghotugiddy@gmail.com
password: gV4wQ4Z2

Also users created by admin will receive email of their login details

Happy Collaboration!
