# CodeReview AI

An interactive, premium, AI-powered code review workspace built with React (Vite), Express.js, MongoDB, and LangChain. 

It provides detailed optimizations, style recommendations, performance suggestions, security vulnerability scans, and structural refactoring. The application features a fallback **Local AI Simulator** that enables full testing and usage without requiring active AI provider keys.

---

## ✨ Features
- **Deep Code Analysis**: Generates quality, security, performance, and readability scores.
- **Side-by-Side Diff**: Compare your original input directly with refactored code using a built-in code editor (Monaco Editor).
- **History Log**: Manage, search, filter, and delete previous review reports.
- **Language Support**: Works with JavaScript, TypeScript, Python, Java, and C++.
- **Interactive UI**: Fluid dark mode experience built with modern design principles.
- **Hybrid AI Modes**: Uses OpenAI (`gpt-4o-mini`) or Anthropic (`claude-3-5-sonnet`) with automated fallback to a high-fidelity local simulator if API keys are absent.

---

## 🚀 Quick Start

### 1. Installation
Install all dependencies in the root directory:
```bash
npm install
```
*(This automatically triggers `npm run install:all` to fetch backend and frontend dependencies).*

### 2. Configuration
Create a `.env` file in the `backend/` directory based on the `.env` template:
```env
PORT=5000
MONGO_URI=mongodb+srv://...
# Optional API Keys (Leaves blank to run in Simulator mode)
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
```

### 3. Run the App
Start both frontend and backend dev servers simultaneously with a single command from the project root:
```bash
npm run dev
```
- **Frontend URL**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api`
- **API Health**: `http://localhost:5000/api/health`

---

## 📁 Project Structure
```text
├── backend/            # Express.js backend and controllers
│   ├── api/            # Routes and middleware
│   ├── config/         # DB config
│   ├── models/         # Mongoose Review Schema
│   └── services/       # LangChain & local simulator logic
├── frontend/           # React frontend
│   ├── src/            # Components, pages, context, and styles
│   └── vite.config.js  # Vite server and proxy configuration
├── .gitignore          # Git tracking rules
├── package.json        # Concurrently dev script and workspace definitions
└── README.md           # Project documentation
```

---

## 🛠️ Testing Snippet
Paste this code in the workspace and click **Analyze Code** to test scope refactoring and type equality rules:
```javascript
function verifyAuth(userId, inputToken) {
  var sessionToken = "token_abc_123";
  if (inputToken == sessionToken) {
    console.log("Access granted!");
    return true;
  }
  return false;
}
```
