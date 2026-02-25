# 🧪 Testing Guide - AI Assistant

## Pre-Flight Checklist

Before testing, ensure:
- ✅ Backend dependencies installed (`npm install` in `server/`)
- ✅ `.env` file created with API keys
- ✅ Database tables created (SQL migration run)
- ✅ Backend running on port 5000
- ✅ Frontend running on port 8080

---

## Test 1: Backend Health Check

**Objective:** Verify backend server is alive

```bash
# Method 1: Direct curl
curl http://localhost:5000/api/health

# Expected Response:
{
  "status": "Server is running",
  "timestamp": "2026-02-25T10:30:00Z"
}

# Method 2: Browser
# Open: http://localhost:5000/api/health
# Should show JSON response
```

---

## Test 2: API Key Verification

**Objective:** Check OpenAI API key is configured

```bash
# Check backend console output
# Should NOT show: "⚠️  WARNING: OPENAI_API_KEY not set"

# Expected output:
# 🚀 EduFlow AI Server running on port 5000
# Environment: development
```

---

## Test 3: Database Connection

**Objective:** Verify Supabase tables exist

**In Supabase Dashboard:**

1. Go to SQL Editor
2. Run this query:
```sql
SELECT * FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('chat_history', 'ai_context');
```

3. Should return 2 rows (both tables exist)

---

## Test 4: Send Test Message via API

**Objective:** Test backend chat functionality

```bash
# Using curl (Windows PowerShell):
curl -X POST http://localhost:5000/api/chat `
  -H "Content-Type: application/json" `
  -d '{
    "message": "Hello, what is your name?",
    "userId": "test_user_001"
  }'

# Expected Response (in 1-3 seconds):
{
  "message": "I'm EduFlow, your AI Assistant created to help with education and learning...",
  "success": true,
  "timestamp": "2026-02-25T10:35:00Z"
}
```

---

## Test 5: Chat History Storage

**Objective:** Verify messages saved to database

**Via Supabase Dashboard:**

1. Go to Table Editor
2. Select `chat_history` table
3. Should see your test message
4. Verify columns:
   - `user_id`: "test_user_001"
   - `user_message`: "Hello, what is your name?"
   - `assistant_message`: Contains AI response
   - `created_at`: Recent timestamp

---

## Test 6: Frontend Chat UI

**Objective:** Test complete frontend experience

**Steps:**
1. Open http://localhost:8080
2. Login (or bypass auth if in development)
3. Navigate to Dashboard
4. Click "AI Assistant" in sidebar
5. Type message: "What is React?"
6. Hit Enter or click Send
7. Wait for response (1-3 seconds)
8. Verify message appears in chat

**Expected:**
- ✅ User message shown in blue
- ✅ AI response shown in gray
- ✅ Timestamps display correctly
- ✅ No error messages

---

## Test 7: Voice Input

**Objective:** Test speech-to-text

**Prerequisites:**
- Browser supports Web Speech API (Chrome, Edge, Safari)
- Microphone attached/enabled

**Steps:**
1. Open AI Assistant page
2. Click microphone button 🎤
3. Speak clearly: "What is Python?"
4. Button changes color (red = recording)
5. Stop speaking
6. Message appears in input box
7. System auto-sends or click Send

**Expected:**
- ✅ Microphone button toggles
- ✅ Transcribed text appears
- ✅ AI responds appropriately

**Troubleshooting:**
- Chrome: Check microphone permissions
- Mac: System Preferences → Security & Privacy → Microphone
- Windows: Settings → Privacy → Microphone

---

## Test 8: Voice Output

**Objective:** Test text-to-speech

**Steps:**
1. Send a message and get AI response
2. Click speaker icon 🔊 on AI response
3. Listen for response being read aloud

**Expected:**
- ✅ System voice speaks the response
- ✅ Speaker button shows active state
- ✅ Audio plays through system speakers

**Troubleshooting:**
- Check browser volume
- Verify system speakers work
- Try different browser

---

## Test 9: Conversation Context

**Objective:** Verify AI remembers previous messages

**Steps:**
1. First message: "I'm interested in machine learning"
2. Second message: "What should I learn first?"
3. AI should reference your interest in ML

**Expected Response:**
Should mention ML-related fundamentals, not generic advice

---

## Test 10: Clear Chat Function

**Objective:** Test conversation clearing

**Steps:**
1. Start a conversation (ask 2-3 questions)
2. Click "Clear Chat" button
3. Chat should reset
4. Greeting message reappears

**Expected:**
- ✅ All messages cleared
- ✅ Initial greeting restored
- ✅ New conversation starts fresh

---

## Test 11: Language Selection

**Objective:** Test language page

**Steps:**
1. Click "Languages" in sidebar
2. See grid of 12 languages
3. Click on "Spanish" 🇪🇸
4. See checkmark appear
5. Click "Save Language Preference"

**Expected:**
- ✅ Language highlighted with checkmark
- ✅ No errors on save

---

## Test 12: Settings Page

**Objective:** Test settings functionality

**Steps:**
1. Click "Settings" in sidebar
2. Toggle "Enable notifications" ON/OFF
3. Select different language from dropdown
4. Click "Bright Mode" button 🌞
5. Verify app background changes to light
6. Click "Dark Mode" button 🌙
7. Verify app background changes to dark

**Expected:**
- ✅ All toggles work
- ✅ App theme changes immediately
- ✅ Settings page visible in all themes

---

## Performance Tests

### Response Time Test
```bash
# Measure time to first response
time curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hi","userId":"perf_test"}'

# Should be: 1-3 seconds typically
# Longer = might need to check API quota
```

### Concurrent Users Test
```bash
# Test with multiple requests
for i in {1..5}; do
  curl -X POST http://localhost:5000/api/chat \
    -H "Content-Type: application/json" \
    -d "{\"message\":\"Test $i\",\"userId\":\"concurrent_$i\"}" &
done
wait

# All should complete successfully
```

---

## Error Scenarios

### Test 13: Missing API Key

**Objective:** Verify error handling when API key missing

**Steps:**
1. Remove `OPENAI_API_KEY` from `.env`
2. Restart backend
3. Try sending message

**Expected:**
```json
{
  "error": "OpenAI API key not configured",
  "success": false
}
```

---

### Test 14: Invalid Message

**Objective:** Test validation

**Steps:**
1. Send empty message (just spaces)
2. Click Send

**Expected:**
- Button disabled, nothing sent

---

### Test 15: Server Offline

**Objective:** Test offline error handling

**Steps:**
1. Stop backend server
2. Try sending message from frontend

**Expected:**
```json
{
  "error": "Failed to fetch",
  "success": false
}
```
Frontend shows error message to user

---

## Database Query Tests

### Get User's Chat History

```sql
-- Query in Supabase SQL Editor
SELECT * FROM chat_history 
WHERE user_id = 'test_user_001'
ORDER BY created_at DESC
LIMIT 10;
```

**Expected:** All messages from that user in reverse chronological order

### Get Today's Activity

```sql
SELECT user_id, COUNT(*) as message_count 
FROM chat_history
WHERE DATE(created_at) = CURRENT_DATE
GROUP BY user_id;
```

**Expected:** Aggregated stats by user

---

## Browser Compatibility Tests

Test on different browsers:

| Browser | Voice Input ✅ | Chat ✅ | Settings ✅ |
|---------|---|---|---|
| Chrome 120+ | ✅ | ✅ | ✅ |
| Firefox 121+ | ✅ | ✅ | ✅ |
| Safari 17+ | ✅ | ✅ | ✅ |
| Edge 120+ | ✅ | ✅ | ✅ |
| Mobile Safari | ⚠️ | ✅ | ✅ |

---

## Mobile Testing

**Steps:**
1. Deploy frontend to accessible URL
2. Open on mobile device
3. Test chat, voice, settings

**Considerations:**
- Voice input may be limited on mobile
- Test portrait and landscape
- Check touch responsiveness

---

## Load Testing (Advanced)

```bash
# Using Apache Bench (ab command)
ab -n 100 -c 10 http://localhost:5000/api/health

# Using siege (better for APIs)
siege -u http://localhost:5000/api/health -r 10 -c 5

# Should handle without errors
```

---

## Security Tests

### SQL Injection Test

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message":"'; DROP TABLE chat_history; --",
    "userId":"hack_test"
  }'

# Should return normal response (safe)
# Table should still exist
```

### XSS Test

```bash
# Send message with HTML/JavaScript
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message":"<script>alert(\"xss\")</script>",
    "userId":"xss_test"
  }'

# Should be treated as text, not executed
```

---

## Test Report Template

```markdown
# Test Report - [Date]

## Summary
- Tests Passed: __/15
- Critical Issues: 0
- Warnings: 0

## Detailed Results

### Backend Tests
- [ ] Health check: PASS/FAIL
- [ ] API key config: PASS/FAIL
- [ ] Database connection: PASS/FAIL
- [ ] Chat API: PASS/FAIL

### Frontend Tests
- [ ] Chat UI: PASS/FAIL
- [ ] Voice input: PASS/FAIL
- [ ] Voice output: PASS/FAIL
- [ ] Settings: PASS/FAIL

### Integration Tests
- [ ] Message persistence: PASS/FAIL
- [ ] Context awareness: PASS/FAIL
- [ ] Error handling: PASS/FAIL

## Issues Found
1. [If any]: Description and severity

## Recommendations
- [Any improvements noted]

## Sign-off
Tester: ___________
Date: ___________
```

---

## Quick Test Loop (5 minutes)

For rapid testing:

```bash
# 1. Health check (10 seconds)
curl http://localhost:5000/api/health

# 2. Send test message (20 seconds)
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Test message","userId":"quick_test"}'

# 3. Check database (30 seconds)
# Open Supabase → Table Editor → chat_history
# Verify message appears

# 4. Frontend test (3 minutes)
# Open http://localhost:8080
# Navigate to AI Assistant
# Type and send message
# Verify response appears
```

---

## Automated Testing (For Production)

Create a test script `test-ai.js`:

```javascript
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function runTests() {
  try {
    // Test 1: Health
    console.log('Testing health...');
    const health = await axios.get(`${API_URL}/health`);
    console.log('✅ Health check passed');

    // Test 2: Chat
    console.log('Testing chat...');
    const chat = await axios.post(`${API_URL}/chat`, {
      message: 'Hello',
      userId: 'auto_test_' + Date.now()
    });
    console.log('✅ Chat test passed');
    console.log('Response:', chat.data.message);

    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

runTests();
```

Run with: `node test-ai.js`

---

## When Tests Are Complete

If all tests pass:
- ✅ Backend is configured correctly
- ✅ OpenAI integration works
- ✅ Database stores data
- ✅ Frontend communicates with backend
- ✅ Voice features work
- ✅ Ready for production deployment

---

## Next Steps

1. **Monitor Logs** - Check for errors during use
2. **Gather Feedback** - Test with actual users
3. **Optimize** - Improve based on metrics
4. **Scale** - Deploy to production
5. **Iterate** - Add new features

---

**Happy Testing! 🚀**
