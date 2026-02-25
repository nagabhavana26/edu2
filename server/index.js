import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:8080',
  credentials: true,
}));
app.use(express.json());

// Store conversation history in memory (in production, use database)
const conversationHistory = new Map();

// Initialize chat helper
const initializeChat = (userId) => {
  if (!conversationHistory.has(userId)) {
    conversationHistory.set(userId, [
      {
        role: 'system',
        content: `You are EduFlow, a helpful educational AI assistant. You are knowledgeable about:
- Programming (Python, JavaScript, etc.)
- Web Development (HTML, CSS, React, Node.js)
- Data Science and Machine Learning
- Mathematics and Physics
- Online Learning and Course Enrollment
- Study Tips and Time Management
- Career Guidance in Tech

Be helpful, concise, and engaging. Always encourage learning and provide accurate information.
If you don't know something, be honest about it and suggest where they might find the answer.`,
      },
    ]);
  }
  return conversationHistory.get(userId);
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Chat endpoint with OpenAI
app.post('/api/chat', async (req, res) => {
  const { message, userId = 'anonymous' } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }

  try {
    // Get or initialize conversation history
    const chat = initializeChat(userId);

    // Add user message to history
    chat.push({
      role: 'user',
      content: message,
    });

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: chat,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const assistantMessage = response.choices[0].message.content;

    // Add assistant response to history
    chat.push({
      role: 'assistant',
      content: assistantMessage,
    });

    // Keep only last 20 messages to avoid too long context
    if (chat.length > 22) {
      chat.splice(1, chat.length - 22); // Keep system message + 20 recent messages
    }

    // Save to database (optional, for persistent storage)
    try {
      await supabase.from('chat_history').insert({
        user_id: userId,
        user_message: message,
        assistant_message: assistantMessage,
        created_at: new Date().toISOString(),
      });
    } catch (dbError) {
      console.error('Database error (non-critical):', dbError);
    }

    res.json({
      message: assistantMessage,
      success: true,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({
      error: error.message || 'Failed to get response from AI',
      success: false,
    });
  }
});

// Get conversation history endpoint
app.get('/api/chat-history/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(50);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ history: data || [] });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: error.message });
  }
});

// Clear conversation history for a user
app.post('/api/chat-clear/:userId', (req, res) => {
  const { userId } = req.params;
  conversationHistory.set(userId, [
    {
      role: 'system',
      content: `You are EduFlow, a helpful educational AI assistant. You are knowledgeable about:
- Programming (Python, JavaScript, etc.)
- Web Development (HTML, CSS, React, Node.js)
- Data Science and Machine Learning
- Mathematics and Physics
- Online Learning and Course Enrollment
- Study Tips and Time Management
- Career Guidance in Tech

Be helpful, concise, and engaging. Always encourage learning and provide accurate information.
If you don't know something, be honest about it and suggest where they might find the answer.`,
    },
  ]);

  res.json({ message: 'Conversation cleared', success: true });
});

// Transcribe audio endpoint (speech to text)
app.post('/api/transcribe', async (req, res) => {
  const { audioUrl, audioBlob } = req.body;

  try {
    // This would use Google Cloud Speech-to-Text or similar
    // For now, we'll return a placeholder
    res.json({
      transcription: 'Audio transcription feature coming soon',
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Synthesize speech endpoint (text to speech)
app.post('/api/synthesize', async (req, res) => {
  const { text, language = 'en' } = req.body;

  try {
    // This would use Google Cloud Text-to-Speech or similar
    // For now, we'll return a placeholder
    res.json({
      audioUrl: 'audio-url-here',
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: err.message || 'Internal server error',
    success: false,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', success: false });
});

app.listen(PORT, () => {
  console.log(`🚀 EduFlow AI Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  WARNING: OPENAI_API_KEY not set. AI features will not work.');
  }
});
