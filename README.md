# 🎓 Alumni-Verse

A comprehensive alumni networking platform that connects students with alumni, facilitating mentorship, job opportunities, events, and community engagement.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Routes](#api-routes)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Features
- **Authentication & Authorization**: Secure login with JWT and Google OAuth 2.0
- **Role-Based Access**: Separate dashboards for Students and Alumni
- **Profile Management**: Comprehensive user profiles with avatar uploads via Cloudinary
- **Social Feed**: Create, like, comment, and share posts with the community
- **Real-Time Messaging**: Chat with connections using Socket.IO
- **Connection System**: Send and manage connection requests

### Networking Features
- **Alumni Directory**: Browse and filter alumni by skills, location, and company
- **Advanced Search**: Search for users, posts, jobs, and events
- **Mentorship Program**: Request and manage mentorship relationships
- **Leaderboard**: Track and showcase top contributors in the community

### Career Features
- **Job Board**: Post and browse job opportunities
- **Startup Showcase**: Discover and promote alumni startups
- **Events**: Create, manage, and RSVP to alumni events

### Additional Features
- **Responsive Design**: Mobile-friendly interface with Material-UI and TailwindCSS
- **Interactive UI**: Smooth animations with Particles.js background
- **File Uploads**: Support for images and documents via Cloudinary

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19.1.1 with Vite 7.1.6
- **Routing**: React Router DOM 7.9.1
- **UI Libraries**: 
  - Material-UI (MUI) 7.3.2
  - TailwindCSS 4.1.13
  - Lucide React Icons
- **Real-Time**: Socket.IO Client 4.8.1
- **HTTP Client**: Axios 1.12.2
- **Animations**: TSParticles 3.9.1
- **Carousel**: Swiper 12.0.2

### Backend
- **Runtime**: Node.js with Express 5.1.0
- **Database**: MongoDB with Mongoose 8.18.2
- **Authentication**: 
  - Passport.js with Google OAuth 2.0
  - JWT (jsonwebtoken 9.0.2)
  - bcryptjs 3.0.2
- **Real-Time**: Socket.IO 4.8.1
- **File Upload**: Multer 2.0.2 with Cloudinary 1.41.3
- **Session Management**: Express-Session 1.19.0
- **Security**: CORS for cross-origin requests

## 📁 Project Structure

```
Alumni-Verse/
├── alumniVerseBackend/          # Backend server
│   ├── config/                  # Configuration files
│   │   ├── cloudinary.js        # Cloudinary setup
│   │   ├── db.js                # MongoDB connection
│   │   └── passport.js          # Passport OAuth config
│   ├── controllers/             # Business logic
│   │   ├── authController.js
│   │   ├── alumniController.js
│   │   ├── connectionController.js
│   │   ├── conversationController.js
│   │   ├── eventController.js
│   │   ├── jobController.js
│   │   ├── leaderboardController.js
│   │   ├── mentorshipController.js
│   │   ├── messageController.js
│   │   ├── postControllers.js
│   │   ├── searchController.js
│   │   ├── startupController.js
│   │   └── userControllers.js
│   ├── middleware/              # Custom middleware
│   │   └── authMiddleware.js
│   ├── models/                  # Mongoose schemas
│   │   ├── Connection.js
│   │   ├── Event.js
│   │   ├── Job.js
│   │   ├── MentorshipRequest.js
│   │   ├── Message.js
│   │   ├── Post.js
│   │   ├── Startup.js
│   │   └── User.js
│   ├── routes/                  # API routes
│   │   ├── authRoutes.js
│   │   ├── alumniRoutes.js
│   │   ├── connectionRoutes.js
│   │   ├── conversationRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── leaderboardRoutes.js
│   │   ├── mentorshipRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── postRoutes.js
│   │   ├── searchRoutes.js
│   │   ├── startupRoutes.js
│   │   └── userRoutes.js
│   ├── server.js                # Express server setup
│   ├── socketHandler.js         # Socket.IO event handlers
│   └── package.json
│
└── AlumniVerseFrontend-p/       # Frontend application
    ├── public/                  # Static assets
    ├── src/
    │   ├── assets/              # Images and media
    │   ├── components/          # Reusable components
    │   │   ├── ChatModal.jsx
    │   │   ├── ChatWindow.jsx
    │   │   ├── CreatePost.jsx
    │   │   ├── FeedPage.jsx
    │   │   ├── MainLayout.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── ParticlesBackground.jsx
    │   │   ├── Post.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/               # Page components
    │   │   ├── AddEventPage.jsx
    │   │   ├── AddJobPage.jsx
    │   │   ├── AlumniDashboard.jsx
    │   │   ├── AlumniDirectoryPage.jsx
    │   │   ├── AlumniListPage.jsx
    │   │   ├── AuthErrorPage.jsx
    │   │   ├── AuthPage.jsx
    │   │   ├── AuthSuccessPage.jsx
    │   │   ├── ConnectionsPage.jsx
    │   │   ├── EventsPage.jsx
    │   │   ├── FeedPage.jsx
    │   │   ├── FindMentorPage.jsx
    │   │   ├── HomePage.jsx
    │   │   ├── JobDetailPage.jsx
    │   │   ├── JobsPage.jsx
    │   │   ├── LandingPage.jsx
    │   │   ├── LeaderboardPage.jsx
    │   │   ├── MentorshipRequestsPage.jsx
    │   │   ├── MessagesPage.jsx
    │   │   ├── MyMentorshipsPage.jsx
    │   │   ├── OnboardingForm.jsx
    │   │   ├── PostDetailPage.jsx
    │   │   ├── ProfileEditPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   ├── SearchPage.jsx
    │   │   ├── StartupPage.jsx
    │   │   ├── StudentDashboard.jsx
    │   │   └── UserProfilePage.jsx
    │   ├── api.js               # API service layer
    │   ├── App.jsx              # Main app component
    │   ├── main.jsx             # Entry point
    │   ├── App.css              # Global styles
    │   └── index.css            # Base styles
    ├── index.html
    ├── vite.config.js           # Vite configuration
    ├── vercel.json              # Vercel deployment config
    └── package.json
```

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)
- Google OAuth credentials

### Clone the Repository
```bash
git clone https://github.com/lord-0011/Alumni-Verse.git
cd Alumni-Verse
```

### Backend Setup
```bash
cd alumniVerseBackend
npm install
```

### Frontend Setup
```bash
cd AlumniVerseFrontend-p
npm install
```

## 🔐 Environment Variables

### Backend (.env)
Create a `.env` file in the `alumniVerseBackend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Session Secret
SESSION_SECRET=your_session_secret_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
Create a `.env` file in the `AlumniVerseFrontend-p` directory:

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

## 🏃‍♂️ Running the Application

### Development Mode

#### Start Backend Server
```bash
cd alumniVerseBackend
npm run dev
# Server runs on http://localhost:5000
```

#### Start Frontend Development Server
```bash
cd AlumniVerseFrontend-p
npm run dev
# Application runs on http://localhost:5173
```

### Production Mode

#### Backend
```bash
cd alumniVerseBackend
npm start
```

#### Frontend
```bash
cd AlumniVerseFrontend-p
npm run build
npm run preview
```

## 🔌 API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:id` - Get user by ID
- `POST /api/users/avatar` - Upload avatar

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get post by ID
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/comment` - Add comment

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create job posting
- `GET /api/jobs/:id` - Get job details
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event
- `GET /api/events/:id` - Get event details
- `POST /api/events/:id/rsvp` - RSVP to event

### Mentorship
- `GET /api/mentorship/requests` - Get mentorship requests
- `POST /api/mentorship/request` - Send mentorship request
- `PUT /api/mentorship/:id/accept` - Accept request
- `PUT /api/mentorship/:id/reject` - Reject request

### Connections
- `GET /api/connections` - Get user connections
- `POST /api/connections/request` - Send connection request
- `PUT /api/connections/:id/accept` - Accept connection
- `PUT /api/connections/:id/reject` - Reject connection

### Messages
- `GET /api/messages/:conversationId` - Get messages
- `POST /api/messages` - Send message
- `GET /api/conversations` - Get user conversations

### Search
- `GET /api/search` - Search across platform

### Alumni
- `GET /api/alumni` - Get alumni directory
- `GET /api/alumni/:id` - Get alumni profile

### Startups
- `GET /api/startups` - Get all startups
- `POST /api/startups` - Create startup listing

### Leaderboard
- `GET /api/leaderboard` - Get leaderboard rankings

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Priyanshu Kumar**
- GitHub: [@lord-0011](https://github.com/lord-0011)

// 💁‍♂️ Contributors

**Kunal**
- GitHub: [@lord-0011](https://github.com/lord-0011)

**Navjot**
- GitHub: [@lord-0011](https://github.com/lord-0011)

**Soham**
- GitHub: [@lord-0011](https://github.com/sohamactive)


## 🙏 Acknowledgments

- Material-UI for the component library
- Socket.IO for real-time functionality
- Cloudinary for media management
- MongoDB for the database solution

---


**Note**: This is currently an educational project for learning full-stack development with the MERN stack, Can be in production in future
