-- Create chat_history table for storing AI conversations
CREATE TABLE IF NOT EXISTS chat_history (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id TEXT NOT NULL,
  user_message TEXT NOT NULL,
  assistant_message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_created_at ON chat_history(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Create policy for users to see only their own chat history
CREATE POLICY "Users can view their own chat history" ON chat_history
  FOR SELECT USING (auth.uid()::text = user_id OR user_id = 'anonymous');

CREATE POLICY "Users can insert their own chat messages" ON chat_history
  FOR INSERT WITH CHECK (auth.uid()::text = user_id OR user_id = 'anonymous');

-- Create ai_context table for storing user context and preferences
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

-- Create index for context table
CREATE INDEX IF NOT EXISTS idx_ai_context_user_id ON ai_context(user_id);

-- Enable RLS on ai_context
ALTER TABLE ai_context ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own context" ON ai_context
  FOR ALL USING (auth.uid()::text = user_id);
