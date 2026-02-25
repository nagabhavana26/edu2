# EduFlow AI Assistant Backend Setup Guide

## Overview
This is the backend server for EduFlow's AI Assistant. It provides real-time AI responses powered by OpenAI's GPT-3.5 model with conversation history management and speech-to-text capabilities.

## Architecture

### Components
- **Express.js Server** - REST API for chat and assistant features
- **OpenAI Integration** - GPT-3.5 Turbo model for intelligent responses
- **Supabase Database** - Persistent storage for conversation history
- **Web Speech API** - Browser-based voice input/output

## Prerequisites

Before setting up, ensure you have:
1. **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2. **OpenAI API Key** - [Get from OpenAI](https://platform.openai.com/api-keys)
3. **Supabase Account** - [Sign up at Supabase](https://supabase.com/)
4. **npm or yarn** - Package manager

## Installation Steps

### 1. Install Dependencies

Navigate to the server directory and install packages:

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your-api-key-here

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:8080

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Get Your API Keys

#### OpenAI API Key:
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API keys section
4. Create new secret key
5. Copy and paste into `.env`

#### Supabase Keys:
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to Settings > API
4. Copy `Project URL` and `anon public key`
5. Generate new service role key if needed

### 4. Set Up Database

Run the migration SQL in Supabase:

1. Go to Supabase Dashboard
2. Navigate to SQL Editor
3. Create new query
4. Copy contents from `supabase/migrations/20260225_ai_assistant_schema.sql`
5. Execute the query

This creates:
- `chat_history` table - Stores all conversations
- `ai_context` table - Stores user preferences and context
- Row Level Security policies - Protects user data

### 5. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

You should see:
```
🚀 EduFlow AI Server running on port 5000
Environment: development
```

## API Endpoints

### Chat Endpoint
**POST** `/api/chat`

Send a message and get AI response:

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is Python?",
    "userId": "user_123"
  }'
```

**Response:**
```json
{
  "message": "Python is a high-level, interpreted programming language...",
  "success": true,
  "timestamp": "2026-02-25T10:30:00Z"
}
```

### Health Check
**GET** `/api/health`

Check if server is running:

```bash
curl http://localhost:5000/api/health
```

### Chat History
**GET** `/api/chat-history/:userId`

Retrieve conversation history:

```bash
curl http://localhost:5000/api/chat-history/user_123
```

### Clear Conversation
**POST** `/api/chat-clear/:userId`

Clear conversation history for a user:

```bash
curl -X POST http://localhost:5000/api/chat-clear/user_123
```

## Features

### ✅ Implemented
- OpenAI GPT-3.5 Integration
- Conversation history with context awareness
- Multi-user support
- Web Speech API for voice input
- Browser Speech Synthesis for voice output
- Error handling and validation
- CORS support for frontend integration
- Database persistence

### 🔄 In Development
- Google Cloud Speech-to-Text integration
- Google Cloud Text-to-Speech enhancement
- Conversation summarization
- User context personalization
- Advanced analytics

### 📋 Future Features
- Fine-tuned model for education domain
- Real-time webcam integration
- Document analysis and summarization
- Quiz generation from content
- Multi-language support

## Troubleshooting

### Error: "OpenAI API key not configured"
- Check `.env` file exists
- Verify `OPENAI_API_KEY` is set correctly
- Ensure no spaces in the key

### Error: "CORS error"
- Check `CLIENT_URL` in `.env` matches your frontend URL
- Ensure server is running on correct port

### Error: "Cannot connect to Supabase"
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Check network connectivity
- Ensure project exists on Supabase

### Error: "Port already in use"
- Change `PORT` in `.env` to a different port (e.g., 5001)
- Or kill process using port 5000:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:5000 | xargs kill -9
  ```

## Frontend Integration

The frontend connects to this API via:
- API URL: `http://localhost:5000/api`
- Configured in frontend `.env`: `REACT_APP_API_URL`

### Making Requests from Frontend:

```typescript
const response = await fetch('http://localhost:5000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: userMessage,
    userId: currentUserId,
  }),
});

const data = await response.json();
console.log(data.message); // AI response
```

## Performance Tips

1. **Limit conversation history** - Keep only recent messages in context
2. **Use appropriate models** - gpt-3.5-turbo is faster than gpt-4
3. **Implement caching** - Cache common questions
4. **Monitor API usage** - Watch OpenAI billing dashboard
5. **Database optimization** - Index frequently queried columns

## Cost Considerations

- **OpenAI**: ~$0.002 per 1K tokens for GPT-3.5
- **Supabase**: Free tier includes 500MB database
- **Hosting**: Choose from Vercel, Railway, Heroku, etc.

## Security Best Practices

1. ✅ Never commit `.env` file with real keys
2. ✅ Use environment variables for sensitive data
3. ✅ Enable Row Level Security in Supabase
4. ✅ Implement request rate limiting
5. ✅ Validate all user inputs
6. ✅ Use HTTPS in production
7. ✅ Regularly rotate API keys

## Need Help?

- **OpenAI Docs**: https://platform.openai.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Express.js Docs**: https://expressjs.com/
- **Issues**: Create an issue in the repository

## License

MIT License - Feel free to use this backend for educational purposes
