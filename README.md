# 📸 Instagram Clone API

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
</p>

<p align="center">
  <strong>Instagram Clone Backend API</strong> - A full-featured social media API built with NestJS, TypeORM, and MySQL
</p>

## 🚀 Project Overview

This is a comprehensive Instagram clone backend API that provides all the core features of a social media platform. Built with modern technologies and best practices, this project demonstrates advanced backend development skills including authentication, file uploads, real-time features, and database design.

### ✨ Key Features

- **🔐 Authentication & Authorization**
  - JWT-based authentication
  - Email verification with OTP
  - Password reset functionality
  - Refresh token mechanism

- **👥 User Management**
  - User registration and login
  - Profile management (avatar, bio, personal info)
  - User search and discovery

- **📱 Post Management**
  - Create posts with multiple images
  - Image upload to Cloudinary
  - Post captions and descriptions
  - Post editing and deletion

- **❤️ Social Interactions**
  - Like/unlike posts
  - Comment on posts
  - Follow/unfollow users
  - Save posts to collections

- **📧 Email Notifications**
  - Welcome emails
  - Password reset emails
  - Account verification emails

## 🛠️ Technology Stack

### Backend Framework
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **TypeORM** - Object-Relational Mapping

### Database
- **MySQL** - Relational database
- **TypeORM** - Database ORM with migrations

### Authentication & Security
- **Passport.js** - Authentication middleware
- **JWT** - JSON Web Tokens
- **bcrypt** - Password hashing
- **class-validator** - Input validation

### File Storage
- **Cloudinary** - Cloud image storage
- **Multer** - File upload handling

### Email Service
- **Nodemailer** - Email sending
- **Handlebars** - Email templates

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **Swagger** - API documentation

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MySQL** (v8.0 or higher)
- **Git**

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd instagram
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=instagram_clone

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key

# Email Configuration (Gmail example)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE instagram_clone;
```

2. The application will automatically create tables using TypeORM's `synchronize: true` option (development only).

### 5. Run the Application

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

Once the application is running, you can access the Swagger API documentation at:
```
http://localhost:3000/api
```

### Main API Endpoints

#### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/verify-email` - Verify email with OTP
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password

#### Users
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `GET /users/search` - Search users
- `POST /users/upload-avatar` - Upload profile picture

#### Posts
- `GET /posts` - Get all posts (with pagination)
- `POST /posts` - Create new post
- `GET /posts/:id` - Get specific post
- `PUT /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post
- `POST /posts/:id/images` - Upload images to post

#### Social Interactions
- `POST /likes/toggle` - Like/unlike post
- `POST /comments` - Add comment
- `PUT /comments/:id` - Update comment
- `DELETE /comments/:id` - Delete comment
- `POST /follows/toggle` - Follow/unfollow user
- `POST /save-posts/toggle` - Save/unsave post

## 🗄️ Database Schema

### Core Entities

#### Users
- `userId` (Primary Key)
- `fullName`, `email`, `username`
- `password` (hashed)
- `bio`, `avatarUrl`
- `isActive`, `otp`, `refreshToken`

#### Posts
- `postId` (Primary Key)
- `caption`
- `userId` (Foreign Key)
- `createdAt`

#### PostImages
- `imageId` (Primary Key)
- `imageUrl`
- `postId` (Foreign Key)

#### Comments
- `commentId` (Primary Key)
- `content`
- `userId`, `postId` (Foreign Keys)

#### Likes
- `likeId` (Primary Key)
- `userId`, `postId` (Foreign Keys)

#### Follows
- `followId` (Primary Key)
- `followerId`, `followingId` (Foreign Keys)

#### SavePosts
- `saveId` (Primary Key)
- `userId`, `postId` (Foreign Keys)

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e

# Generate test coverage
npm run test:cov
```

## 📦 Build & Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive validation using class-validator
- **CORS Protection**: Configured for cross-origin requests
- **Rate Limiting**: Built-in request rate limiting
- **SQL Injection Protection**: TypeORM provides protection against SQL injection

## 🚀 Performance Optimizations

- **Database Indexing**: Proper indexing on frequently queried fields
- **Lazy Loading**: Efficient relationship loading
- **Caching**: JWT token caching
- **Image Optimization**: Cloudinary handles image optimization
- **Pagination**: Implemented for large datasets

## 📁 Project Structure

```
src/
├── entities/           # Database entities/models
├── modules/           # Feature modules
│   ├── auth/         # Authentication module
│   ├── user/         # User management
│   ├── post/         # Post management
│   ├── comment/      # Comment system
│   ├── like/         # Like system
│   ├── follow/       # Follow system
│   ├── save-post/    # Save post functionality
│   ├── mail/         # Email service
│   └── cloudinary/   # File upload service
├── middleware/       # Custom middleware
├── guards/          # Authentication guards
├── passport/        # Passport strategies
├── utils/           # Utility functions
└── exceptions/      # Custom exception filters
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Your Name** - Backend Developer

- **Email**: your.email@example.com
- **LinkedIn**: [Your LinkedIn Profile]
- **GitHub**: [Your GitHub Profile]

---

⭐ **Star this repository if you find it helpful!**
