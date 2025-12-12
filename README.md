# 🌟 AuraLearn Frontend

> Transform your coding journey with AI-powered learning, interactive challenges, and real-time feedback.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38b2ac?logo=tailwind-css)](https://tailwindcss.com/)

## 🚀 What is AuraLearn?

AuraLearn is a **revolutionary web development learning platform** that combines:

- 📚 **Comprehensive HTML & CSS Courses** - Master the foundations of web development
- 🤖 **AI-Powered Assistant (AuraBot)** - Instant help when you get stuck
- 💻 **Live Code Editor** - Write, execute, and test code in real-time
- 🎯 **Interactive Challenges** - Hands-on activities with instant feedback
- 📊 **Progress Analytics** - Track your learning journey with detailed insights
- 🏆 **Achievement System** - Earn badges and certificates as you level up
- 🎓 **Personalized Learning Paths** - Customized curriculum based on your pace

## ✨ Key Features

### For Learners
- **Interactive Lessons** - Learn by doing with embedded code playgrounds
- **Instant Feedback** - Get real-time validation on your code exercises
- **AI Tutoring** - Ask AuraBot questions and get personalized explanations
- **Progress Tracking** - See your improvement across courses and topics
- **Certificates** - Earn verified certificates upon course completion
- **Leaderboards** - Compete and learn with fellow developers

### For Instructors & Admins
- **Course Management** - Create and organize courses with ease
- **Student Analytics** - Deep insights into learner progress and performance
- **Submission Review** - Grade and provide feedback on student work
- **User Management** - Monitor and support your learning community
- **Activity Tracking** - Detailed logs of all platform activities

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend Framework** | Next.js 16 (App Router) |
| **UI Library** | React 19 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS + SCSS |
| **UI Components** | Ant Design |
| **State Management** | React Context API |
| **HTTP Client** | Fetch API with custom hooks |
| **Build Tool** | Turbopack (Next.js default) |

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- Git

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd AuraLearn-Frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API endpoints

# Run development server
npm run dev

# Open your browser
# Visit http://localhost:3000
```

### Environment Variables

Create a `.env.local` file:

```env
# API Endpoints
NEXT_PUBLIC_API_BASE=https://your-backend-api.com
NEXT_PUBLIC_ADMIN_API_BASE=https://your-admin-api.com
NEXT_PUBLIC_USER_API_BASE=https://your-user-api.com

```

## 🚀 Available Scripts

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type checking
npx tsc --noEmit
```

## 📂 Project Structure

```
app/                    # Next.js app directory
├── layout.tsx         # Root layout
├── page.tsx          # Home page
├── admin/            # Admin dashboard routes
├── course/           # Course detail pages
├── activity/         # Activity/lesson pages
├── dashboard/        # User dashboard
├── exercises/        # Exercise pages
└── settings/         # Settings pages

components/           # Reusable React components
├── admin/           # Admin-specific components
├── auth/            # Authentication components
├── ui/              # UI primitives
└── ...

lib/                 # Utilities and helpers
├── *-api.ts        # API client functions
├── auth-context.tsx # Auth state management
└── utils.ts        # Helper functions

hooks/               # Custom React hooks
├── use-lesson-tracker.ts
├── use-api-cache.ts
└── ...

styles/              # Global styles
```

## 🎯 Core Modules

### 🔐 Authentication
- Secure login/signup for students and admins
- Session management with context API
- Role-based access control

### 📚 Course Management
- Browse and enroll in HTML & CSS courses
- Structured lessons with learning objectives
- Progress tracking per course

### 💻 Code Editor
- Live HTML/CSS editor with syntax highlighting
- Real-time preview of rendered code
- Save and load code snippets

### 🤖 AI Assistant (AuraBot)
- Context-aware Q&A system
- RAG (Retrieval-Augmented Generation) powered
- Instant explanations and code suggestions

### 📈 Analytics & Reporting
- Student performance metrics
- Course completion rates
- Time spent on activities
- Submission analysis

## 🔗 API Integration

The frontend communicates with the backend via RESTful APIs:

- **Base URL**: `NEXT_PUBLIC_API_BASE`
- **Timeout**: 30 seconds
- **Error Handling**: Global error boundaries and retry logic
- **Caching**: Built-in caching for performance

See [lib/](./lib/) for API client implementations.

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Deploy to Vercel
npm run build
npm start

# Or use Vercel CLI
vercel deploy
```

### Environment Variables on Vercel
Set the same `.env.local` variables in Vercel project settings.

## 🐛 Troubleshooting

### Build Issues
- Clear `.next` folder: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (requires 18+)

### CORS Issues
- Frontend uses `/api` proxy to backend (configured in `next.config.ts`)
- In development, all API calls route through Next.js proxy
- In production, direct API calls are made from browser

### Hydration Errors
- Handled by `hydration-fix.js` and `HydrationErrorBoundary`
- Run `npm run build` to test for hydration issues

## 📚 Documentation

- [Activity System](./docs/ACTIVITY_SYSTEM.md) - How activities and submissions work
- [API Integration](./lib/) - API client usage examples
- [Troubleshooting Guide](./TROUBLESHOOTING.md) - Common issues and solutions

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is part of the AuraLearn platform. All rights reserved.

## 🙋 Support

- 📧 **Email**: support@auralearn.dev
- 💬 **Chat**: Use AuraBot for instant help within the platform
- 📖 **Docs**: Check our comprehensive documentation
- 🐛 **Issues**: Report bugs on GitHub

## 🎉 Getting Started with Your First Course

1. **Sign Up** - Create your account in seconds
2. **Explore Courses** - Browse HTML & CSS courses
3. **Start Learning** - Follow interactive lessons with real code examples
4. **Practice** - Complete hands-on activities and challenges
5. **Get Help** - Ask AuraBot whenever you're stuck
6. **Earn Certificates** - Complete courses and showcase your skills

---

**Ready to transform your coding journey?** Start learning on [AuraLearn](https://auralearn.dev) today! 🚀
