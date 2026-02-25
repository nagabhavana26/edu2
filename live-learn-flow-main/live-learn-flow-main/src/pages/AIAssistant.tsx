import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageCircle,
  Send,
  Mic,
  MicOff,
  Volume2,
  Loader,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hello! I'm your EduFlow AI Assistant. I'm here to help you with questions about courses, programming, data science, mathematics, and more. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const userIdRef = useRef<string>("user_" + Math.random().toString(36).substr(2, 9));

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setInput((prev) => prev + transcript);
          } else {
            interimTranscript += transcript;
          }
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setError(`Voice input error: ${event.error}`);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    const userMsgId = Date.now().toString();

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        type: "user",
        content: userMessage,
        timestamp: new Date(),
      },
    ]);

    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      // Call backend API
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          userId: userIdRef.current,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to get response");
      }

      const aiMsgId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        {
          id: aiMsgId,
          type: "assistant",
          content: data.message,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      console.error("Chat error:", err);

      // Add error message to chat
      const errorMsgId = (Date.now() + 2).toString();
      setMessages((prev) => [
        ...prev,
        {
          id: errorMsgId,
          type: "assistant",
          content: `Sorry, I encountered an error: ${errorMessage}. Please check if the server is running or try again later.`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      setError("Speech recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setError(null);
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "1",
        type: "assistant",
        content:
          "Hello! I'm your EduFlow AI Assistant. I'm here to help you with questions about courses, programming, data science, mathematics, and more. How can I assist you today?",
        timestamp: new Date(),
      },
    ]);
    setError(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI Assistant</h1>
            <p className="text-sm text-muted-foreground">
              Powered by OpenAI - Ask anything about education & technology
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearChat}
          className="gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Clear Chat
        </Button>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-destructive">Error</p>
              <p className="text-xs text-muted-foreground mt-1">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-sidebar-border h-[600px] flex flex-col">
        <CardHeader className="border-b border-sidebar-border">
          <CardTitle>Chat with AI Assistant</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-4">
          <ScrollArea className="h-full">
            <div className="space-y-4 pr-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === "user"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-secondary text-secondary-foreground rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.type === "user"
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  {message.type === "assistant" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2"
                      onClick={() => handleSpeak(message.content)}
                      disabled={isSpeaking}
                      title="Click to hear the response"
                    >
                      <Volume2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg rounded-bl-none flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="border-sidebar-border">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isListening ? "🎤 Listening..." : "Type your question..."}
              disabled={isLoading || isListening}
              className="flex-1"
            />
            <Button
              onClick={handleVoiceInput}
              variant={isListening ? "destructive" : "outline"}
              size="icon"
              title="Click to use voice input"
            >
              {isListening ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            💡 Tip: Click the mic button to speak, or type below and press Enter
          </p>
        </CardContent>
      </Card>

      <Card className="border-sidebar-border bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base">✨ Features</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2 text-muted-foreground">
          <p>🤖 AI-powered responses using OpenAI GPT-3.5</p>
          <p>🎤 Voice input & output with speech recognition</p>
          <p>💾 Conversation history saved to database</p>
          <p>🧠 Context-aware responses using chat memory</p>
          <p>📚 Knowledge about programming, data science, math & more</p>
          <p>🌐 Multi-language support</p>
        </CardContent>
      </Card>
    </div>
  );
}
