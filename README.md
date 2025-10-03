# 🎨 PrismArt - Collaborative Drawing Application

A modern, real-time collaborative drawing application built with Next.js, WebSockets, and Prisma. PrismArt allows users to create shared drawing spaces, collaborate in real-time, and communicate through integrated chat functionality.

## ✨ Features

- 🎨 **Real-time Collaborative Drawing** - Draw together with friends and colleagues in real-time
- 💬 **Integrated Chat System** - Communicate while drawing with built-in chat functionality
- 🔐 **User Authentication** - Secure login and registration system
- 🏠 **Room Management** - Create and join drawing rooms with unique URLs
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- ⚡ **Real-time Updates** - Instant synchronization of drawings and messages
- 🎯 **Modern UI/UX** - Beautiful interface built with Tailwind CSS and Radix UI

## 🏗️ Architecture

This project is built as a monorepo using Turborepo with the following structure:

### Applications

- **`apps/web-forntend`** - Next.js frontend application
- **`apps/http-backend`** - Express.js REST API server
- **`apps/ws-backend`** - WebSocket server for real-time communication

### Packages

- **`packages/common`** - Shared TypeScript types and utilities
- **`packages/backend-common`** - Backend-specific shared code
- **`packages/db`** - Prisma database schema and client
- **`packages/eslint-config`** - Shared ESLint configurations
- **`packages/typescript-config`** - Shared TypeScript configurations

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- pnpm (recommended) or npm
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sword-sketch
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create `.env` files in the following locations:
   
   **Root `.env`:**
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/prismart"
   JWT_SECRET="your-jwt-secret-key"
   ```

4. **Set up the database**
   ```bash
   cd packages/db
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development servers**
   ```bash
   # Start all applications
   pnpm dev
   
   # Or start individual applications
   pnpm dev --filter=web-forntend
   pnpm dev --filter=http-backend
   pnpm dev --filter=ws-backend
   ```

## 🛠️ Development

### Available Scripts

- **`pnpm dev`** - Start all applications in development mode
- **`pnpm build`** - Build all applications and packages
- **`pnpm lint`** - Run ESLint on all packages
- **`pnpm format`** - Format code with Prettier
- **`pnpm check-types`** - Run TypeScript type checking

### Project Structure

```
sword-sketch/
├── apps/
│   ├── web-forntend/          # Next.js frontend
│   │   ├── app/               # App router pages
│   │   ├── components/        # React components
│   │   └── lib/               # Utility functions
│   ├── http-backend/          # Express.js API server
│   │   ├── src/
│   │   │   ├── controller/    # Route controllers
│   │   │   ├── middleware/    # Express middleware
│   │   │   └── router/        # API routes
│   └── ws-backend/            # WebSocket server
│       └── src/               # WebSocket handlers
├── packages/
│   ├── common/                # Shared types
│   ├── backend-common/        # Backend utilities
│   ├── db/                    # Database schema
│   ├── eslint-config/         # ESLint configs
│   └── typescript-config/     # TypeScript configs
└── turbo.json                 # Turborepo configuration
```

## 🎨 Frontend (web-forntend)

Built with Next.js 15, featuring:

- **App Router** - Modern Next.js routing system
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation library
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Sonner** - Toast notifications

### Key Components

- **Authentication Pages** - Login and signup forms
- **Canvas View** - Main drawing interface
- **Room Management** - Create and join drawing rooms
- **Navigation** - Responsive navbar with user controls

## 🔧 Backend Services

### HTTP Backend (http-backend)

Express.js server providing:

- **User Authentication** - JWT-based auth with bcrypt password hashing
- **Room Management** - CRUD operations for drawing rooms
- **User Management** - User registration and profile management
- **CORS Support** - Cross-origin resource sharing

### WebSocket Backend (ws-backend)

Real-time communication server featuring:

- **Drawing Synchronization** - Real-time drawing updates
- **Chat Messaging** - Instant message delivery
- **Room Management** - User join/leave notifications
- **Connection Handling** - Robust WebSocket connection management

## 🗄️ Database

PostgreSQL database with Prisma ORM:

### Schema

- **User** - User accounts with authentication
- **Room** - Drawing rooms with unique slugs
- **Chat** - Messages within rooms

### Key Features

- **UUID Primary Keys** - Secure user identification
- **Unique Constraints** - Email and room slug uniqueness
- **Relationships** - Proper foreign key relationships
- **Timestamps** - Automatic creation timestamps

## 🔐 Authentication

- **JWT Tokens** - Secure authentication tokens
- **Password Hashing** - bcrypt for secure password storage
- **Protected Routes** - Authentication middleware
- **Session Management** - Client-side token storage

## 🌐 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Rooms
- `GET /rooms` - List user's rooms
- `POST /rooms` - Create new room
- `GET /rooms/:slug` - Get room details
- `DELETE /rooms/:id` - Delete room

### Users
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile

## 🚀 Deployment

### Environment Variables

Ensure the following environment variables are set:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# JWT
JWT_SECRET="your-secure-jwt-secret"

# CORS (if needed)
CORS_ORIGIN="http://localhost:3000"
```

### Build for Production

```bash
# Build all applications
pnpm build

# Start production servers
pnpm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**uzwal**
- Twitter: [@isuzwal](https://twitter.com/isuzwal)
- GitHub: [@isuzwal](https://github.com/isuzwal)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Database management with [Prisma](https://www.prisma.io/)
- Monorepo management with [Turborepo](https://turbo.build/)

---

**PrismArt** - Where creativity meets collaboration! 🎨✨