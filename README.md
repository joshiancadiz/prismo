<div align="center">
  <img src="public/prismo-logo.svg" alt="Prismo AI Logo" width="120" height="120" />

  # Prismo AI

  **AI-Powered YouTube Script Extraction & Text Processing Platform**

  Built with Next.js, Supabase, and multiple AI models to extract, enhance, paraphrase, and translate YouTube video scripts.

  ![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
  ![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3FCF8E?style=for-the-badge&logo=supabase)
  ![Vercel](https://img.shields.io/badge/Vercel-Deployed-000?style=for-the-badge&logo=vercel)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss)

</div>

---

## 📖 About

Prismo AI is a desktop web application that extracts transcripts from YouTube videos and shorts, then processes them using AI-powered tools. It provides a suite of text processing features including transcript cleanup, paraphrasing with tone control, and multi-language translation — all within a clean, modern dashboard interface.

---

## ✨ Features

- **🎬 YouTube Script Extraction** — Paste any YouTube video or Shorts URL to extract its transcript with timestamps
- **✏️ AI Text Enhancement** — Clean up raw transcripts by removing filler words, fixing punctuation, and improving readability
- **🔄 AI Paraphrasing** — Rewrite text in 8 different tones (Calm, Bold, Urgent, Formal, Casual, Persuasive, Friendly, Professional)
- **🌍 AI Translation** — Translate text between languages with natural, tone-preserving translations
- **📊 Dashboard Overview** — View usage statistics and quick-access cards for all tools
- **📜 History Tracking** — Full history of all extraction and AI processing actions stored in Supabase
- **🔐 Google Authentication** — Simple one-click Google OAuth login via Supabase Auth
- **🌗 Dark / Light Mode** — Toggle between dark and light themes with `next-themes`
- **📱 Collapsible Sidebar** — Responsive sidebar navigation with collapsible AI Tools dropdown

---

## 🤖 AI Models & Services

| Feature | AI Provider | Model | Purpose |
|---|---|---|---|
| **Text Enhancement** | Google Gemini | `gemini-2.5-flash-lite` | Cleans transcripts — removes filler words, fixes punctuation & grammar |
| **Paraphrasing** | Google Gemini | `gemini-2.5-flash` | Rewrites text in a user-selected tone while preserving meaning |
| **Translation** | Groq | `llama-3.3-70b-versatile` | Translates text between languages with natural fluency |
| **Script Extraction** | [ytscribe.ai](https://ytscribe.ai) | — | External API to extract transcripts from YouTube videos & Shorts |

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **Authentication** | [Supabase Auth](https://supabase.com/auth) (Google OAuth) |
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL) |
| **AI – Gemini** | [@google/genai](https://www.npmjs.com/package/@google/genai) SDK |
| **AI – Groq** | [groq-sdk](https://www.npmjs.com/package/groq-sdk) |
| **Transcript API** | [ytscribe.ai](https://ytscribe.ai) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Theme** | [next-themes](https://github.com/pacocoursey/next-themes) |
| **Deployment** | [Vercel](https://vercel.com/) |
| **Keep-Alive Cron** | [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs) |

---

## 🏗️ Project Structure

```
prismo/
├── public/                     # Static assets (logo, SVGs)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── cron/           # Vercel cron job (keep Supabase alive)
│   │   │   ├── enhance/        # POST /api/enhance
│   │   │   ├── paraphrase/     # POST /api/paraphrase
│   │   │   ├── translate/      # POST /api/translate
│   │   │   └── youtube/        # POST /api/youtube
│   │   ├── auth/callback/      # OAuth callback handler
│   │   ├── dashboard/
│   │   │   ├── ai_enhance/     # Enhance page
│   │   │   ├── ai_paraphrase/  # Paraphrase page
│   │   │   ├── ai_translate/   # Translate page
│   │   │   ├── history/        # History page
│   │   │   ├── script_extract/ # YouTube script extraction page
│   │   │   ├── settings/       # Settings page (theme toggle)
│   │   │   └── page.tsx        # Dashboard overview
│   │   ├── login/              # Login page (Google OAuth)
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Redirects to /dashboard
│   ├── components/
│   │   ├── sidebar.tsx         # Collapsible sidebar navigation
│   │   ├── themeProvider.tsx    # next-themes provider
│   │   ├── themeToggle.tsx     # Dark/Light mode toggle
│   │   ├── historyTable.tsx    # History display table
│   │   ├── userProfile.tsx     # User profile display
│   │   ├── logoutButton.tsx    # Logout button
│   │   └── footer.tsx          # Footer component
│   ├── lib/
│   │   ├── ai_tools/
│   │   │   ├── enhance.ts      # Gemini 2.5 Flash Lite – transcript enhancement
│   │   │   ├── paraphrase.ts   # Gemini 2.5 Flash – tone-based paraphrasing
│   │   │   └── translate.ts    # Groq Llama 3.3 70B – translation
│   │   ├── prompts/
│   │   │   └── prompts.ts      # System prompts for all AI tools
│   │   ├── supabase/           # Supabase helpers (getHistory, getUser, updateHistory)
│   │   └── youtube/
│   │       ├── transcript.ts   # ytscribe.ai transcript fetching & deduplication
│   │       ├── metadata.ts     # YouTube video metadata extraction
│   │       ├── parse.ts        # URL parsing utilities
│   │       └── validation.ts   # Input validation
│   └── utils/supabase/         # Supabase client/server utilities
├── vercel.json                 # Vercel cron configuration
├── package.json
└── tsconfig.json
```

---

## ⏰ Vercel Cron – Supabase Keep-Alive

Supabase free-tier projects are paused after periods of inactivity. To prevent this, a Vercel Cron Job pings the database every **3 days**:

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/keep-alive",
      "schedule": "0 0 */3 * *"
    }
  ]
}
```

This ensures the Supabase instance stays active without manual intervention.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- A [Supabase](https://supabase.com/) project with Google OAuth configured
- API keys for Google Gemini, Groq, and ytscribe.ai

### 1. Clone the repository

```bash
git clone https://github.com/your-username/prismo.git
cd prismo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI API Keys
GEMINI_API_KEY=your_google_gemini_api_key
GROQ_API_KEY=your_groq_api_key

# YouTube Transcript
YT_TRANSCRIPT_API=your_ytscribe_api_key
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📄 License

This project is for personal/educational use.
