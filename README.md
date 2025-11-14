# DSA Tracker - Production-Ready MERN Application

A full-stack TypeScript application for tracking Data Structures & Algorithms practice with gamification features, Monaco editor integration, and comprehensive testing.

## 🚀 Features

### Frontend
- **React + Vite + TypeScript** - Fast development with modern tooling
- **Tailwind CSS** - Utility-first styling with custom design tokens
- **Dark Mode** - System preference aware with manual toggle
- **shadcn/ui conventions** - Accessible, reusable component patterns
- **Framer Motion** - Smooth page transitions and animations
- **React Router** - Client-side routing
- **React Query** - Server state management with caching
- **Zustand** - Lightweight client state for practice sessions
- **Monaco Editor** - VS Code-like code editing experience
- **Keyboard Shortcuts** - Power user features (Ctrl+K, Ctrl+Enter, etc.)
- **Auto-save** - Draft preservation every 10 seconds
- **Infinite Scroll** - Efficient problem list rendering
- **Accessibility** - ARIA attributes, keyboard navigation, focus management

### Backend
- **Express + TypeScript** - Type-safe REST API
- **MongoDB + Mongoose** - NoSQL database with ODM
- **JWT Authentication** - Secure token-based auth with refresh tokens
- **Role-Based Access Control** - User and admin roles
- **Bcrypt** - Password hashing
- **Joi Validation** - Request validation middleware
- **Rate Limiting** - DDoS protection
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Service Layer Pattern** - Clean architecture
- **Repository Pattern** - Data access abstraction
- **Centralized Error Handling** - Consistent error responses
- **Request Logging** - Morgan middleware

### DevOps
- **Docker** - Containerized development and deployment
- **Docker Compose** - Multi-service orchestration
- **GitHub Actions** - CI/CD pipeline
- **ESLint + Prettier** - Code quality and formatting
- **Jest + Supertest** - Backend testing
- **React Testing Library** - Frontend component testing

### Gamification
- **Streaks** - Daily practice tracking
- **Badges** - Achievement system
- **Progress Dashboard** - Visual statistics

## 📋 Prerequisites

- Node.js 18+ and npm 9+
- Docker and Docker Compose (optional, recommended)
- MongoDB 7.0+ (if not using Docker)
- Git

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd javascript
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and update the following critical values:

**Required Changes for Production:**
- `JWT_SECRET` - Use a strong random string (32+ characters)
- `JWT_REFRESH_SECRET` - Use a different strong random string
- `MONGODB_URI` - Your MongoDB connection string
- `FRONTEND_URL` - Your frontend domain

**Example Production Values:**
```env
NODE_ENV=production
JWT_SECRET=9a8f7d6e5c4b3a2109876543210fedcba
JWT_REFRESH_SECRET=1234567890abcdef1234567890abcdef
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dsa_tracker
FRONTEND_URL=https://your-app.vercel.app
```

### 3. Installation

#### Option A: Using Docker (Recommended)

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

This starts:
- MongoDB on `localhost:27017`
- Backend API on `localhost:5000`
- Frontend on `localhost:5173`

#### Option B: Local Development

```bash
# Install root dependencies
npm install

# Install all workspace dependencies
npm run install:all

# Or manually:
cd frontend && npm install
cd ../backend && npm install
```

### 4. Database Setup

#### MongoDB Atlas (Recommended for Production)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP (or use 0.0.0.0/0 for testing)
5. Get your connection string
6. Update `MONGODB_URI` in `.env`

#### Local MongoDB

```bash
# Start MongoDB (if installed locally)
mongod --dbpath ./data

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

### 5. Seed the Database

```bash
# From project root
npm run seed

# Or directly in backend
cd backend
npm run seed
```

This creates:
- 10 sample DSA problems (Easy/Medium/Hard)
- Sample tags (Arrays, Strings, Trees, etc.)
- Admin user: `admin@example.com` / `admin123`
- Test user: `user@example.com` / `user123`

### 6. Run the Application

#### Docker

```bash
docker-compose up -d
```

#### Local Development

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev

# Or from root (concurrent)
npm run dev
```

Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/api/health

## 🧪 Testing

```bash
# Run all tests
npm test

# Frontend tests only
npm run test:frontend

# Backend tests only
npm run test:backend

# Watch mode
cd frontend && npm run test:watch
cd backend && npm run test:watch
```

## 🏗️ Project Structure

```
javascript/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route pages
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API services
│   │   ├── store/            # Zustand stores
│   │   ├── lib/              # Utilities and helpers
│   │   ├── types/            # TypeScript types
│   │   └── App.tsx           # Root component
│   ├── public/               # Static assets
│   └── package.json
├── backend/                  # Express backend API
│   ├── src/
│   │   ├── models/           # Mongoose models
│   │   ├── routes/           # API routes
│   │   ├── controllers/      # Route controllers
│   │   ├── services/         # Business logic
│   │   ├── middleware/       # Express middleware
│   │   ├── utils/            # Utilities
│   │   ├── types/            # TypeScript types
│   │   └── app.ts            # Express app
│   ├── tests/                # Integration tests
│   └── package.json
├── .github/
│   └── workflows/
│       └── ci.yml            # GitHub Actions CI
├── docker-compose.yml        # Docker orchestration
├── .env.example              # Environment template
└── README.md                 # This file
```

## 📝 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Register new user | None |
| POST | `/api/auth/login` | Login user | None |
| POST | `/api/auth/refresh` | Refresh access token | Refresh Token |
| GET | `/api/auth/me` | Get current user | JWT |

### Problem Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/problems` | List problems (paginated, filtered) | JWT |
| GET | `/api/problems/:id` | Get problem details | JWT |
| POST | `/api/problems` | Create problem | Admin |
| PUT | `/api/problems/:id` | Update problem | Admin |
| DELETE | `/api/problems/:id` | Delete problem | Admin |

### Submission Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/submissions` | Submit solution | JWT |
| GET | `/api/submissions` | Get user submissions | JWT |
| GET | `/api/submissions/:id` | Get submission details | JWT |

### Run Endpoint

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/run` | Run code with test cases | JWT |

### Dashboard Endpoint

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/dashboard` | Get user stats | JWT |

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Open problem search |
| `Ctrl+Enter` | Run test cases |
| `Alt+N` | Next problem |
| `Alt+P` | Previous problem |
| `B` | Bookmark problem |
| `Escape` | Close drawer/modal |

## 🎨 Design Tokens

The application uses a consistent design system:

- **Colors:** Indigo primary, Teal accent, Neutral grays
- **Spacing:** 4px base unit (4, 8, 12, 16, 24, 32, 48, 64)
- **Border Radius:** sm (4px), md (8px), lg (12px), xl (16px)
- **Shadows:** Elevation-based shadow system
- **Typography:** Inter font family

## 🚀 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables:
   ```
   VITE_API_URL=https://your-api.herokuapp.com/api
   ```
4. Deploy

### Backend (Render/Heroku)

#### Render

1. Create new Web Service
2. Connect GitHub repository
3. Build command: `cd backend && npm install && npm run build`
4. Start command: `cd backend && npm start`
5. Add environment variables from `.env.example`

#### Heroku

```bash
# Login
heroku login

# Create app
heroku create your-app-name

# Add MongoDB
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set JWT_SECRET=your-secret
heroku config:set FRONTEND_URL=https://your-app.vercel.app

# Deploy
git subtree push --prefix backend heroku main
```

### Database (MongoDB Atlas)

See step 4 in Setup Instructions above.

## 🔒 Security Best Practices

- ✅ All passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens expire (15min access, 7d refresh)
- ✅ Rate limiting on all endpoints
- ✅ CORS configured
- ✅ Helmet security headers
- ✅ Input validation with Joi
- ✅ MongoDB injection prevention
- ✅ XSS protection
- ⚠️ **IMPORTANT:** Change JWT secrets before production!
- ⚠️ **IMPORTANT:** Use HTTPS in production
- ⚠️ **IMPORTANT:** Restrict CORS origin to your domain

## 🧹 Code Quality

```bash
# Lint all code
npm run lint

# Fix lint issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check
```

## 📊 Performance

- **Frontend:** Vite for instant HMR, code splitting, tree shaking
- **Backend:** MongoDB indexes on frequent queries
- **Caching:** React Query with stale-while-revalidate
- **Pagination:** Server-side with cursor/offset
- **Lazy Loading:** React.lazy for route-based code splitting
- **Image Optimization:** WebP with fallbacks

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5000
npx kill-port 5000

# Kill process on port 5173
npx kill-port 5173
```

### MongoDB Connection Failed

```bash
# Check MongoDB is running
docker ps | grep mongo

# Restart MongoDB
docker-compose restart mongodb

# Check logs
docker-compose logs mongodb
```

### Dependencies Issues

```bash
# Clean install
rm -rf node_modules frontend/node_modules backend/node_modules
npm run install:all
```

## 📚 Tech Stack

### Frontend
- React 18
- TypeScript 5
- Vite 5
- Tailwind CSS 3
- React Router 6
- React Query (TanStack Query) 5
- Zustand 4
- Monaco Editor
- Framer Motion 11
- React Testing Library
- Jest

### Backend
- Node.js 18+
- Express 4
- TypeScript 5
- MongoDB 7
- Mongoose 8
- JWT (jsonwebtoken)
- Bcrypt
- Joi
- Helmet
- Morgan
- Express Rate Limit
- Supertest
- Jest

## 🎯 Next Steps

After completing the setup:

- [ ] Customize branding (logo, colors, name)
- [ ] Add more DSA problems via Admin panel
- [ ] Configure MongoDB Atlas for production
- [ ] Set up environment variables in Vercel/Render
- [ ] Enable GitHub Actions secrets for CI/CD
- [ ] Add custom badges and achievements
- [ ] Implement email verification (optional)
- [ ] Add social auth (Google, GitHub) (optional)
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure analytics (Google Analytics, PostHog)
- [ ] Add more test cases
- [ ] Implement real code execution (Docker sandbox)
- [ ] Add collaborative features (leaderboards, discussions)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🙋 Support

For issues and questions:
- Open a GitHub issue
- Check existing documentation
- Review API endpoints in `/backend/src/routes`

---

Built with ❤️ using the MERN stack and TypeScript
