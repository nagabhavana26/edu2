# 🚀 EduFlow AI Assistant - Complete Setup Guide

## Quick Start (5 minutes)

### Prerequisites
- Node.js v16+ installed
- OpenAI API key (free trial available)
- Supabase account (free tier works)

### Step 1: Get API Keys

#### OpenAI Key (2 min)
1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-`)

#### Supabase Keys (2 min)
1. Go to https://app.supabase.com
2. Select/create project
3. Go to Settings → API
4. Copy `Project URL` and create service role key (if needed)

### Step 2: Configure Backend

```bash
# Navigate to server
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your keys (use any text editor)
# OPENAI_API_KEY=sk-your-key
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_SERVICE_ROLE_KEY=your-key
```

### Step 3: Setup Database

1. Go to Supabase Dashboard
2. Click "SQL Editor" → "New Query"
3. Copy this SQL and run it:

```sql
CREATE TABLE IF NOT EXISTS chat_history (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id TEXT NOT NULL,
  user_message TEXT NOT NULL,
  assistant_message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS ai_context (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id TEXT NOT NULL UNIQUE,
  preferred_language TEXT DEFAULT 'en',
  learning_goals TEXT,
  skill_level TEXT,
  interests TEXT ARRAY,
  conversation_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Optional: Add indexes for better performance
CREATE INDEX idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX idx_chat_history_created_at ON chat_history(created_at DESC);
```

### Step 4: Start Everything

**Terminal 1 - Backend Server:**
```bash
cd server
npm run dev
# Should see: 🚀 EduFlow AI Server running on port 5000
```

**Terminal 2 - Frontend (in main project directory):**
```bash
npm run dev
# Should see: ➜ Local: http://localhost:8080/
```

### Step 5: Test It!

1. Open http://localhost:8080
2. Login or navigate to the dashboard
3. Click "AI Assistant" in sidebar
4. Type a question like "What is Python?"
5. Wait for AI response 🤖

---

## ✨ Features Included

### Voice & Text
- 🎤 **Voice Input** - Click mic and speak your question
- 🔊 **Voice Output** - Click speaker to hear responses
- ⌨️ **Text Input** - Type messages and press Enter

### AI Intelligence
- 🧠 **Context Aware** - Remembers conversation history
- 📚 **Knowledgeable** - Answers on programming, data science, math, etc.
- 💬 **Natural Language** - Understands complex questions
- 🎓 **Educational Focus** - Designed for learning

### Data Management
- 💾 **Chat History** - All conversations saved to database
- 👤 **User Profiles** - Track user preferences
- 🔒 **Secure** - Row Level Security enabled

---

## 🛠️ Architecture

```
┌─────────────────────────────────────┐
│     Frontend (React + TypeScript)    │
│  - Chat UI                          │
│  - Voice Input/Output               │
│  - Message Display                  │
└────────────┬────────────────────────┘
             │ HTTP Requests
             ▼
┌─────────────────────────────────────┐
│    Backend (Express.js)             │
│  - API Endpoints                    │
│  - OpenAI Integration               │
│  - Conversation Management          │
└────────────┬────────────────────────┘
             │ Database Queries
             ▼
┌─────────────────────────────────────┐
│   Supabase (PostgreSQL)             │
│  - Chat History                     │
│  - User Context                     │
│  - Persistent Storage               │
└─────────────────────────────────────┘

             │ API Calls
             ▼
┌─────────────────────────────────────┐
│    OpenAI GPT-3.5 API               │
│  - Intelligent Responses            │
│  - Natural Language Understanding   │
└─────────────────────────────────────┘
```

---

## API Endpoints

### POST /api/chat
Send message and get AI response

**Request:**
```json
{
  "message": "What is machine learning?",
  "userId": "user_123"
}
```

**Response:**
```json
{
  "message": "Machine learning is...",
  "success": true,
  "timestamp": "2026-02-25T10:30:00Z"
}
```

### GET /api/health
Check if server is alive

### GET /api/chat-history/:userId
Get all conversations for a user

### POST /api/chat-clear/:userId
Clear conversation history

---

## 🐛 Troubleshooting

### "Cannot connect to server"
```bash
# Check if backend is running
curl http://localhost:5000/api/health

# If not, start it:
cd server && npm run dev
```

### "OpenAI API error"
- Check API key in `.env`
- Verify key has credits/tokens available
- See usage at https://platform.openai.com/usage

### "CORS error"
- Ensure backend is running on port 5000
- Check `CLIENT_URL` in backend `.env`
- Frontend `.env` should have: `REACT_APP_API_URL=http://localhost:5000/api`

### "Database connection error"
- Verify Supabase URL and key in backend `.env`
- Check tables exist in Supabase (run SQL migration)
- Confirm project is active in Supabase dashboard

---

## 💡 Usage Tips

### For Better Responses
- Ask specific questions
- Provide context: "I'm learning Python..."
- Ask follow-up questions in conversation
- Use voice for natural interaction

### Cost Optimization
- OpenAI usage shown in dashboard
- gpt-3.5-turbo is cheaper than gpt-4
- Batch conversations efficiently
- Monitor API usage regularly

### Advanced Features

**Enable Multiple Languages:**
1. Go to Settings in app
2. Select your language
3. AI will respond in that language

**Track Learning Progress:**
- Check Analytics section
- Review conversation history
- See improvement over time

---

## 📊 What's Happening Behind Scenes

When you ask: "What is machine learning?"

1. **Frontend** captures text/voice input
2. **Frontend** sends to backend API
3. **Backend** adds message to conversation history
4. **Backend** sends to OpenAI with context
5. **OpenAI** generates intelligent response
6. **Backend** saves to Supabase database
7. **Backend** returns response to frontend
8. **Frontend** displays with optional voice output
9. **All stored** in database for future reference

Average response time: 1-3 seconds ⚡

---

## 🔐 Security Notes

✅ Do's:
- Store API keys in `.env` file
- Never push `.env` to git
- Use environment variables
- Enable database security

❌ Don'ts:
- Share API keys publicly
- Commit `.env` file
- Use production keys in development
- Disable security features

---

## 🚀 Deployment

To deploy to production:

### Backend Options
- **Railway** - Easy, $5/month starting
- **Heroku** - Popular, free tier ended
- **AWS** - Scalable, pay-as-you-go
- **Vercel** - Fast, for serverless

### Frontend Options
- **Vercel** - Optimized for Next.js/React
- **Netlify** - Simple, auto-deploys from git
- **AWS** - Enterprise grade

---

## 📚 Learning Resources

- **OpenAI**: https://platform.openai.com/docs
- **Supabase**: https://supabase.com/docs
- **Express.js**: https://expressjs.com
- **React**: https://react.dev

---

## 📞 Support

Need help? Check these files:
- `server/README.md` - Backend setup details
- `src/pages/AIAssistant.tsx` - Frontend code
- `server/index.js` - API implementation

---

## 🎉 You're All Set!

Your AI Assistant is ready to help students learn! 

**Next Steps:**
1. ✅ Test voice input/output
2. ✅ Ask it educational questions
3. ✅ Try different topics
4. ✅ Check conversation history
5. ✅ Customize as needed

Happy learning! 🚀
