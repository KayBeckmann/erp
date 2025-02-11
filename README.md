# ERP Project

This repository contains a modular ERP system built using a microservice architecture with Docker. It consists of separate containers for the frontend (Vite + Vue with Dexie for local storage and PWA capabilities), the backend (Express with JWT authentication), and the MySQL database.

## Project Structure

```
/erp
├── docker-compose.yml
├── common
│   └── models
│       └── User.js            # Shared model for frontend & backend
├── backend
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js              # Main server entry point
│   ├── db.js                  # Database initialization and connection
│   ├── routes
│   │   └── auth.js            # Authentication routes (login, register)
│   └── models
│       └── User.js            # Backend user model and admin initialization
└── frontend
    ├── Dockerfile
    ├── package.json
    ├── vite.config.js         # Vite configuration (host set to 0.0.0.0)
    ├── index.html             # HTML entry point
    └── src
        ├── main.js            # Application entry point
        ├── App.vue            # Root Vue component
        ├── router
        │   └── index.js       # Vue Router configuration with authentication guard
        ├── components
        │   ├── Login.vue      # Login component
        │   └── Dashboard.vue  # Dashboard component for logged in users
        └── db
            └── dexie.js       # Dexie configuration for local IndexedDB storage
```

## Setup and Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/erp-project.git
   cd erp-project
   ```

2. **Build and Start the Docker Containers:**

   This project uses Docker Compose to orchestrate the services. Run:

   ```bash
   docker-compose up --build
   ```

3. **Accessing the Application:**

   - **Frontend:** Open [http://localhost:5173](http://localhost:5173) in your browser.
   - **Backend:** The API is available at [http://localhost:3000](http://localhost:3000).

## Backend Details

- **Express** is used as the web server.
- **JWT** is implemented for user authentication.
- **MySQL** is used as the database.
- An initial admin user (username: `admin`, password: `admin`) is automatically created if it does not exist.
- The backend code includes a retry mechanism to handle delayed availability of the MySQL container.

## Frontend Details

- **Vite + Vue 3** provides a fast development environment.
- **Dexie.js** is used for local IndexedDB storage in the PWA.
- **Vue Router** includes navigation guards to redirect unauthenticated users to the login page.
- The Vite dev server is configured to listen on `0.0.0.0` (see `vite.config.js`) to be accessible from outside the Docker container.

## Common Code

The file `common/models/User.js` contains a shared User model, ensuring consistency between the frontend and backend.

## Troubleshooting

- **Database Connection Issues:**  
  If the backend fails to connect to the MySQL container, check the container logs with:

  ```bash
  docker-compose logs backend
  ```

  The backend will retry the connection until the database is ready.

- **Vite Dev Server Connection Issues:**  
  Ensure that the Vite configuration in `vite.config.js` includes:

  ```js
  server: {
    host: '0.0.0.0',
    port: 5173
  }
  ```

- **Vue Feature Flag Warning:**  
  If you see a warning about `__VUE_PROD_HYDRATION_MISMATCH_DETAILS__`, add the following to your `vite.config.js`:

  ```js
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false;
  }
  ```

## License

This project is licensed under the MIT License.
