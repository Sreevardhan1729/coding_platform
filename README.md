# Coding Platform

This is a full-stack web application that functions as a coding platform, similar to LeetCode or HackerRank. It allows users to sign up, log in, solve coding problems, and submit their solutions.

## Features

*   User authentication (signup and login)
*   Dashboard to view a list of coding problems
*   Detailed view for each problem with a code editor
*   Code submission and evaluation (future implementation)
*   Admin panel to manage problems (future implementation)

## Tech Stack

### Frontend

*   **React:** A JavaScript library for building user interfaces.
*   **Vite:** A fast build tool for modern web development.
*   **TypeScript:** A typed superset of JavaScript.
*   **Tailwind CSS:** A utility-first CSS framework.
*   **Monaco Editor:** The code editor that powers VS Code.
*   **React Router:** For client-side routing.
*   **Axios:** For making HTTP requests to the backend.

### Backend

*   **Django:** A high-level Python web framework.
*   **Django REST Framework:** A powerful and flexible toolkit for building Web APIs.
*   **MongoDB:** A NoSQL document database.
*   **djongo:** A Django connector for MongoDB.
*   **Gunicorn:** A Python WSGI HTTP Server for UNIX.

## Getting Started

### Prerequisites

*   Node.js and npm (or yarn)
*   Python and pip
*   MongoDB

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/CodingPlatform.git
    cd CodingPlatform
    ```

2.  **Backend Setup:**

    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    pip install -r requirements.txt
    # Create a .env file and add your MongoDB URI and other environment variables
    # Example .env file:
    # MONGO_URI=mongodb://localhost:27017/
    # SECRET_KEY=your-secret-key
    python manage.py migrate
    python manage.py runserver
    ```

3.  **Frontend Setup:**

    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## Usage

1.  Start the backend server.
2.  Start the frontend development server.
3.  Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).
4.  Sign up for a new account or log in with an existing one.
5.  From the dashboard, select a problem to solve.
6.  Write your code in the editor and submit it.

## API Endpoints

*   `POST /api/auth/register/`: Register a new user.
*   `POST /api/auth/login/`: Log in a user.
*   `GET /api/problems/`: Get a list of all problems.
*   `GET /api/problems/<slug>/`: Get the details of a specific problem.
*   `POST /api/submit/`: Submit a solution to a problem.

## Folder Structure

```
CodingPlatform/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── backend/
│   ├── problems/
│   ├── submissions/
│   └── users/
└── frontend/
    ├── package.json
    ├── src/
    │   ├── App.tsx
    │   ├── main.tsx
    │   ├── components/
    │   └── pages/
    └── ...
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

This project is licensed under the MIT License.
