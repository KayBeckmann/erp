```markdown
# ERP Project

This repository contains a modular ERP system built with a microservice architecture. The system comprises:

- A **backend** built with Node.js, Express, MySQL, and JWT authentication.
- A **frontend** built with Vue 3, Vite, and Dexie for local storage.
- A **database** running MySQL in a Docker container.

Both the backend and frontend are configured via a single global `.env` file, which is used in both development and production environments.

## Features

- **Modular Architecture:** Separate Docker containers for backend, frontend, and database.
- **Authentication:** JWT-based authentication with user and group management.
- **Multi-Mode Frontend:** In development, the Vite dev server with HMR is used; in production, a production build is served via Nginx.
- **Single Configuration:** A single global `.env` file configures both the backend and frontend.
- **Docker-Compose:** Orchestrates all services with environment variable support.

## Project Structure
```

/erp
├── .env # Global environment variables (create your own from .env.example)
├── .env.example # Example environment variables
├── docker-compose.yml # Docker Compose configuration
├── README.md # This file
├── backend/
│ ├── Dockerfile # Dockerfile for backend
│ ├── package.json
│ ├── server.js
│ ├── db.js
│ ├── models/
│ │ ├── User.js
│ │ └── Group.js
│ └── routes/
│ ├── auth.js
│ ├── users.js
│ └── groups.js
└── frontend/
├── Dockerfile # Multi-stage Dockerfile for frontend (development and production targets)
├── package.json
├── vite.config.js
├── public/
│ └── favicon.ico # Optional favicon file
└── src/
├── main.js
├── App.vue
├── components/
│ ├── Menu.vue
│ ├── Login.vue
│ ├── UserFormModal.vue
│ └── GroupFormModal.vue
└── views/
├── Home.vue
├── Users.vue
└── Groups.vue

````

## Environment Variables

A single `.env` file placed in the project root configures both the backend and frontend. An example is provided in `.env.example`:

```dotenv
# Backend
DB_HOST=db
MYSQL_DATABASE=erp_db
MYSQL_USER=erp_user
MYSQL_PASSWORD=erp_password
MYSQL_ROOT_PASSWORD=rootpassword
PORT=3000
JWT_SECRET=your_jwt_secret
BACKEND_PORT=3000

# Frontend (Vite)
VITE_API_URL=http://localhost:3000
VITE_HMR_HOST=localhost
FRONTEND_PORT=5173
````

For production, update `VITE_API_URL` (and other variables if needed) accordingly.

## Docker Setup

This project uses Docker Compose to orchestrate the services. The configuration supports both development and production modes.

### Development Mode

In development, the frontend container runs the Vite dev server with HMR enabled.

Set the following environment variables in your shell (or adjust your `.env` file):

```bash
export FRONTEND_TARGET=development
export NODE_ENV=development
```

Then run:

```bash
docker-compose up --build
```

Your frontend will be available at `http://localhost:5173` (or the port specified in the `.env` file).

### Production Mode

In production, the frontend container builds a production version and serves it using Nginx.

Set the following environment variables:

```bash
export FRONTEND_TARGET=production
export NODE_ENV=production
```

Also, update `VITE_API_URL` in your `.env` file to point to your production backend URL (e.g., `https://yourdomain.com/api`).

Then run:

```bash
docker-compose up --build -d
```

In production, the Nginx container in the frontend service listens on port 80. Ensure that your firewall (or reverse proxy) forwards external traffic to the correct container ports.

## Docker-Compose Configuration

The `docker-compose.yml` uses the global `.env` file and build arguments to determine whether to run in development or production mode:

```yaml
version: "3.8"

services:
  frontend:
    build:
      context: ./frontend
      # Set the target based on the FRONTEND_TARGET environment variable.
      # Use "development" for local development (Vite dev server) and "production" for a production build.
      target: ${FRONTEND_TARGET:-development}
      args:
        NODE_ENV: ${NODE_ENV:-development}
    ports:
      - "${FRONTEND_PORT:-5173}:${FRONTEND_PORT:-5173}"
    depends_on:
      - backend
    env_file:
      - .env

  backend:
    build:
      context: ./backend
    ports:
      - "${BACKEND_PORT:-3000}:3000"
    depends_on:
      - db
    env_file:
      - .env

  db:
    image: mysql:8
    restart: always
    ports:
      - "${DB_PORT:-3306}:3306"
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-rootpassword}
      MYSQL_DATABASE: ${MYSQL_DATABASE:-erp_db}
      MYSQL_USER: ${MYSQL_USER:-erp_user}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD:-erp_password}
    volumes:
      - db_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  db_data:
```

## Additional Notes

- **Internal Communication:**  
  Containers communicate internally via Docker networking (using service names like `backend` or `db`), so no extra ports need to be exposed for internal traffic.

- **External Access:**  
  Make sure that the ports defined in `docker-compose.yml` (e.g., FRONTEND_PORT and BACKEND_PORT) are accessible from outside or that a reverse proxy (like Nginx) is used to forward traffic.

- **HMR & WebSockets:**  
  HMR (Hot Module Replacement) is active only in development mode. In production, use the built static files served by Nginx.

- **Favicon:**  
  To avoid a 404 error for `favicon.ico`, add your favicon to the `frontend/public` folder.

## Development and Production Workflow

- **Local Development:**  
  Use the dev mode settings (FRONTEND_TARGET=development, NODE_ENV=development) to leverage live reloading and HMR.

- **Production Deployment:**  
  Set FRONTEND_TARGET=production and NODE_ENV=production. Update `VITE_API_URL` as needed, build the containers, and serve the production build with Nginx.

## License

This project is licensed under the MIT License.

```

```
