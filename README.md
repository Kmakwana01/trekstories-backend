# Trekstories Backend API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

The powerhouse behind the Trekstories platform. This is a robust, modular REST API built with **NestJS**, following enterprise-grade architecture patterns.

## 🏗️ Architecture & Structure

The project follows a modular, domain-driven structure for maximum maintainability.

### 📁 Detailed File Tree

```text
trekstories-backend/
├── src/
│   ├── app.module.ts          # Root module of the application
│   ├── main.ts                # Entry point; sets up Swagger, pipes, etc.
│   ├── common/                # Shared logic across the app
│   │   ├── decorators/        # Custom TS decorators
│   │   ├── filters/           # Global exception filters
│   │   ├── guards/            # Authentication & Authorization guards
│   │   ├── interceptors/      # Response transformation interceptors
│   │   └── pipes/             # Validation and transformation pipes
│   ├── config/                # Environment-based configuration
│   ├── database/              # DB connection and base models
│   ├── modules/               # Core business logic modules
│   │   ├── auth/              # JWT & Google OAuth2 Auth
│   │   ├── tours/             # Tour management & catalog
│   │   ├── bookings/          # Reservation logic
│   │   ├── users/             # User profile and account management
│   │   ├── coupons/           # Discount and promo code system
│   │   ├── reviews/           # Rating and feedback system
│   │   ├── payments/          # Payment gateway integrations
│   │   └── ... (see more)
│   ├── utils/                 # General helper utilities
│   └── scripts/               # DB seeding and automation scripts
├── test/                      # E2E and Unit testing suites
├── .github/                   # GitHub Actions (CI/CD)
├── Dockerfile                 # Docker container instructions
├── docker-compose.yml         # Dev environment container orchestrator
└── postman_collection.json    # Ready-to-use API documentation for Postman
```

## 🛠️ Key Technologies

- **NestJS**: A progressive Node.js framework for building efficient server-side applications.
- **Mongoose**: Elegant mongodb object modeling for node.js.
- **Passport**: Flexible authentication middleware for Node.js.
- **Swagger**: Automatic API documentation (accessible at `/api/docs`).
- **Winston**: A versatile logging library.
- **Helmet**: Security-focused HTTP header middleware.

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your details:

```bash
cp .env.example .env
```

### Running the App

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

### API Documentation

Once the server is running, visit:
`http://localhost:5000/api/docs`

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e
```

## 📄 Postman Collection

A full Postman collection is included in the root directory (`postman_collection.json`) to help you get started with the API endpoints immediately.

---

_Maintained with excellence by the Trekstories Dev Team._
