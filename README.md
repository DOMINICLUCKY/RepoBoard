# RepoBoard 🚀

**Instant AI Developer Onboarding & Architecture Analysis**

RepoBoard is a modern web application that analyzes GitHub repositories using AI to provide instant developer onboarding guides, architecture insights, and technical risk assessments. Perfect for teams getting up to speed with new codebases or architects evaluating repository structure.

![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18+-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3+-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

### 🎯 Core Capabilities
- **GitHub URL Analysis** - Paste any public repository URL and get instant analysis
- **AI-Powered Architecture Detection** - Claude AI analyzes code structure and patterns
- **Developer Onboarding** - 6+ step-by-step setup and configuration instructions
- **Tech Stack Detection** - Automatic identification of frameworks, libraries, and tools
- **Complexity Scoring** - Visual gauge showing architectural complexity (1-100)
- **Risk Assessment** - Identifies potential technical debt and scaling concerns
- **Recent Scans History** - Track your analysis history with quick access

### 🎨 UI/UX
- **Dark Mode Design** - Premium developer aesthetic with deep slates and zinc grays
- **Responsive Bento Grid** - Modern dashboard layout that adapts to all screen sizes
- **Real-Time Validation** - GitHub URL validation with helpful error messages
- **Loading States** - Smooth animations and progress indicators
- **Accessible Components** - WCAG-compliant UI with proper ARIA labels

### 💾 Data Management
- **MongoDB Integration** - Optional persistent storage with 24-hour cache
- **Mock Analysis Engine** - Works out-of-the-box with realistic sample data
- **Zero Config** - Database is entirely optional for development

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 3 + PostCSS
- **UI Components:** React 18 with custom components
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js with Next.js API Routes
- **Database:** MongoDB (optional) + Mongoose ODM
- **AI:** Anthropic Claude 3.5 Sonnet
- **APIs:** GitHub REST API v2022-11-28

### DevOps
- **Package Manager:** npm
- **Version Control:** Git
- **Linting:** ESLint
- **Environment:** .env.local for configuration

## 📋 Prerequisites

- **Node.js** 18+ or higher
- **npm** 9+
- **GitHub Account** (for reading public repos)
- **Anthropic API Key** (optional, for real AI analysis)
- **MongoDB URI** (optional, for persistent storage)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/DOMINICLUCKY/RepoBoard.git
cd RepoBoard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create a `.env.local` file in the project root:
```bash
# Required for AI analysis (optional - uses mock data without it)
ANTHROPIC_API_KEY=sk-your-anthropic-key-here

# Optional: For persistent storage
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/repoboard

# Optional: For higher GitHub API limits
# GITHUB_TOKEN=your_github_token_here
```

### 4. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### Analyzing a Repository

1. **Enter GitHub URL**
   - Paste a public repository URL (e.g., `https://github.com/vercel/next.js`)
   - URL is validated in real-time

2. **Wait for Analysis**
   - Real-time progress indicators show analysis stages
   - Typically completes in 3-5 seconds

3. **View Dashboard**
   - See complexity score with visual gauge
   - Review detected tech stack
   - Read project summary
   - Follow onboarding steps
   - Check architecture risks

4. **Track History**
   - Recent Scans show your last 5 analyses
   - Click to revisit repository on GitHub
   - Quick metadata display (date, complexity, architecture)

### Example Repositories to Analyze

- `https://github.com/facebook/react` - Popular UI library
- `https://github.com/vercel/next.js` - Full-stack React framework
- `https://github.com/tailwindlabs/tailwindcss` - Utility CSS framework
- `https://github.com/nodejs/node` - Node.js runtime

## 🔌 API Endpoints

### POST `/api/analyze`
Analyze a GitHub repository.

**Request:**
```json
{
  "repoUrl": "https://github.com/owner/repo"
}
```

**Response (Success 200):**
```json
{
  "techStack": ["React", "TypeScript", "Node.js"],
  "architectureType": "Full-Stack Monorepo",
  "summary": "Description of the project...",
  "onboardingSteps": ["Step 1", "Step 2", ...],
  "potentialRisks": ["Risk 1", "Risk 2", ...],
  "complexityScore": 65
}
```

**Response (Error 400):**
```json
{
  "error": "Invalid GitHub repository URL..."
}
```

### GET `/api/history`
Retrieve recent analyses (requires MongoDB).

**Response:**
```json
{
  "recentScans": [
    {
      "id": "...",
      "repoUrl": "...",
      "owner": "...",
      "repoName": "...",
      "analyzedAt": "2026-06-05T...",
      "architectureType": "...",
      "complexityScore": 65,
      "summary": "..."
    }
  ]
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `ANTHROPIC_API_KEY` | No | Claude API key for AI analysis |
| `MONGODB_URI` | No | MongoDB connection string for caching |
| `GITHUB_TOKEN` | No | GitHub token for higher API limits |

### Development

**Commands:**
```bash
npm run dev      # Start dev server on :3000
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

**File Structure:**
```
RepoBoard/
├── app/
│   ├── api/
│   │   ├── analyze/       # Analysis endpoint
│   │   └── history/       # Recent scans endpoint
│   ├── layout.tsx         # Root layout with navbar
│   ├── page.tsx           # Landing page with form
│   └── globals.css        # Global styles
├── components/
│   ├── DashboardView.tsx  # Analysis dashboard
│   ├── RecentScans.tsx    # History component
│   └── navbar.tsx         # Top navigation
├── lib/
│   ├── dbConnect.ts       # MongoDB connection
│   └── mockAnalysis.ts    # Mock data engine
├── models/
│   └── Analysis.ts        # MongoDB schema
└── public/                # Static assets
```

## 🗄️ Database (Optional)

### Setting Up MongoDB

1. **Create Atlas Cluster** (free tier available)
   - Visit [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Create database user and get connection string

2. **Add to `.env.local`**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/repoboard
   ```

3. **Schema**
   - Collections auto-create on first write
   - Analysis documents store: `repoUrl`, `owner`, `repoName`, `analyzedAt`, `analysis`
   - 24-hour cache for identical repos

## 🤖 AI Analysis (Optional)

### Getting Anthropic API Key

1. Sign up at [console.anthropic.com](https://console.anthropic.com)
2. Create an API key
3. Add to `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-your-key-here
   ```

### Without API Key
- App uses realistic mock analysis data
- Perfect for demos and testing
- Supports React, Next.js, and generic patterns

## 📦 Building for Production

### Vercel (Recommended)
```bash
# Push to GitHub first
git push origin main

# Go to vercel.com → Import Project → Connect GitHub
# Add environment variables in Vercel dashboard
# Auto-deploys on push
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment for Production
- Set `NODE_ENV=production`
- Configure all env variables in deployment platform
- Use strong MongoDB credentials
- Enable GitHub token for API reliability

## 🤝 Contributing

Contributions are welcome! 

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
# Dev server will automatically try 3001
# Or kill the process: lsof -ti:3000 | xargs kill -9
```

### PostCSS Error
- Delete `node_modules` and `.next`
- Run `npm install` again

### MongoDB Connection Fails
- Verify connection string in `.env.local`
- Check IP whitelist in MongoDB Atlas
- App works fine without it (uses mock data)

### API Returns 500
- Check Anthropic API key is valid
- Verify GitHub repo URL is public
- Check server logs in terminal

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/DOMINICLUCKY/RepoBoard/issues)
- **Discussions:** [GitHub Discussions](https://github.com/DOMINICLUCKY/RepoBoard/discussions)
- **Email:** dev@repoboard.local

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- AI powered by [Anthropic Claude](https://www.anthropic.com)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Icons from [Lucide React](https://lucide.dev)
- Database with [MongoDB](https://www.mongodb.com)

---

**Made with ❤️ for developers | [Star on GitHub ⭐](https://github.com/DOMINICLUCKY/RepoBoard)**
