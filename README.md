# Java E-Commerce Platform

A full-stack e-commerce web application built with Spring Boot and React.

## Tech Stack

**Backend:** Java 17, Spring Boot 3.5, Spring Security (JWT), Spring Data JPA, Hibernate, PostgreSQL, ModelMapper, Maven

**Frontend:** React, Vite, Tailwind CSS

## Features

**Authentication**
- JWT-based authentication with access token (30 min) and refresh token (1 day)
- Role-based access control for `ADMIN` and `USER`
- BCrypt password encoding

**Product Management**
- CRUD operations for products, categories, and discounts
- Product image upload (local storage)
- Primary image management

**Order & Cart**
- Shopping cart with item management
- Order placement with stock validation
- Coupon/discount application
- Order status management

**Admin Panel**
- Manage products, categories, orders, users
- Dashboard with order and revenue statistics

**Other**
- Address management per user
- Payment tracking
- Review and rating system
- Notification system

## Project Structure
```
src/
├── main/
│   ├── java/com/NobaraEcommerceWeb/EcommerceWeb/
│   │   ├── config/         # Security, CORS, ModelMapper config
│   │   ├── controller/     # REST API endpoints
│   │   ├── dao/            # JPA repositories
│   │   ├── dto/            # Request and response DTOs
│   │   ├── filter/         # JWT authentication filter
│   │   ├── model/          # JPA entities
│   │   └── service/        # Business logic
│   └── resources/
│       └── application.properties
└── frontend/               # React + Vite frontend
```

## Getting Started

### Prerequisites
- Java 17
- Node.js 18+
- PostgreSQL

### Backend Setup

1. Clone the repository
```bash
git clone https://github.com/nobara050/Java-Ecommerce
cd Java-Ecommerce
```

2. Configure `src/main/resources/application.properties`
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/your_database
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
file.upload-dir=uploads
jwt.secret=your_secret_key
jwt.access-token-expiration=1800000
jwt.refresh-token-expiration=86400000
```

3. Insert default roles
```sql
INSERT INTO roles (role_name, description) VALUES ('USER', 'Regular user');
INSERT INTO roles (role_name, description) VALUES ('ADMIN', 'Administrator');
```

4. Run the backend
```bash
./mvnw spring-boot:run
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### First Admin Account

1. Register via `POST /auth/register`
2. Assign ADMIN role manually in the database
```sql
INSERT INTO accounts_role (accounts_id, role_id) VALUES (1, 2);
```

## API Documentation

Swagger UI is available at:
```
http://localhost:8080/swagger-ui/index.html
```

## License

This project is for educational and portfolio purposes.