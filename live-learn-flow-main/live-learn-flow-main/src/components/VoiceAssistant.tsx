import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Volume2, VolumeX, AlertCircle, Minimize2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VoiceAssistantProps {
  isFloating?: boolean;
}

export function VoiceAssistant({ isFloating = false }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [isMinimized, setIsMinimized] = useState(isFloating);
  const [isLeoWaiting, setIsLeoWaiting] = useState(false);
  const recognitionRef = useRef<any>(null);
  const leoAwakeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Text to Speech
  const speak = (text: string) => {
    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error("Text-to-speech error:", err);
    }
  };

  // Process voice commands
  const processCommand = (text: string) => {
    const lowerText = text.toLowerCase().trim();
    let command = "";
    let destination = "";
    let isLeoGreeting = false;

    if (lowerText.includes("hey leo") || lowerText.includes("hi leo") || lowerText.includes("hello leo")) {
      isLeoGreeting = true;
      command = "Leo is awake!";
      speak("Hi! I'm Leo, your AI assistant. How can I help you?");
      setIsLeoWaiting(true);
      setIsMinimized(false);

      if (leoAwakeTimeoutRef.current) {
        clearTimeout(leoAwakeTimeoutRef.current);
      }
      leoAwakeTimeoutRef.current = setTimeout(() => {
        setIsLeoWaiting(false);
        speak("I'm going to sleep now. Say 'Hey Leo' to wake me up.");
        setFeedback("Leo is sleeping 😴");
      }, 30000);
    } else if (lowerText.includes("hello") || lowerText.includes("hi")) {
      command = "Greeting detected";
      speak("Hello! How can I help you?");
    } else if (lowerText.includes("dashboard")) {
      command = "Opening Dashboard";
      destination = "/dashboard";
      speak("Opening dashboard");
    } else if (lowerText.includes("course")) {
      command = "Opening Courses";
      destination = "/courses";
      speak("Opening courses");
    } else if (lowerText.includes("quiz")) {
      command = "Opening Quizzes";
      destination = "/quizzes";
      speak("Opening quizzes");
    } else if (lowerText.includes("analytic")) {
      command = "Opening Analytics";
      destination = "/analytics";
      speak("Opening analytics");
    } else if (lowerText.includes("job")) {
      command = "Opening Jobs";
      destination = "/jobs";
      speak("Opening jobs");
    } else if (lowerText.includes("profile")) {
      command = "Opening Profile";
      destination = "/profile";
      speak("Opening profile");
    } else if (lowerText.includes("setting")) {
      command = "Opening Settings";
      destination = "/settings";
      speak("Opening settings");
    } else if (lowerText.includes("thank")) {
      command = "Thank you received";
      speak("You're welcome! Let me know if you need anything else.");
    } else {
      command = "Command not recognized";
      speak("Sorry, I didn't understand that. Try: dashboard, courses, quizzes, analytics, jobs, profile, or settings.");
    }

    if (isLeoGreeting) {
      setFeedback(`🟢 ${command}`);
    } else {
      setFeedback(`✓ ${command}`);
    }

    if (destination) {
      setTimeout(() => {
        window.location.href = destination;
      }, 1000);
    }
    
    // Stop recognition after processing
    try {
      recognitionRef.current.abort();
      setIsListening(false);
    } catch (err) {
      console.error("Error aborting recognition:", err);
    }
  };

  // Initialize speech recognition
  useEffect(() => {
    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setIsSupported(false);
        setError("Speech Recognition is not supported in your browser. Please use Chrome, Edge, or Safari.");
        return;
      }

      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => {
        setFeedback("Listening...");
        setError(null);
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const text = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setTranscript(text);
            processCommand(text);
            break;
          }
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        const errorMessage = event.error || "Unknown error";
        if (errorMessage !== "aborted") {
          setError(`Error: ${errorMessage}`);
        }
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      // Don't auto-start
    } catch (err) {
      setIsSupported(false);
      setError("Failed to initialize speech recognition");
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (err) {
          console.error("Error closing recognition:", err);
        }
      }
      if (leoAwakeTimeoutRef.current) {
        clearTimeout(leoAwakeTimeoutRef.current);
      }
    };
  }, []);

  const startListening = () => {
    if (!recognitionRef.current || !isSupported) {
      setError("Speech recognition is not available");
      return;
    }
    try {
      // Stop any ongoing recognition first
      recognitionRef.current.abort();
      
      setTranscript("");
      setError(null);
      setFeedback("");
      setIsListening(true);
      
      // Start fresh
      recognitionRef.current.start();
    } catch (err) {
      console.error("Error starting recognition:", err);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
        setIsListening(false);
      } catch (err) {
        console.error("Error stopping recognition:", err);
      }
    }
  };

  const toggleSpeech = () => {
    try {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else if (feedback) {
        speak(feedback);
      }
    } catch (err) {
      console.error("Speech toggle error:", err);
    }
  };

  const clearTranscript = () => {
    setTranscript("");
    setFeedback("");
    setError(null);
  };

  // Floating widget version
  if (isFloating) {
    return (
      <div className="fixed bottom-6 right-6 z-40 max-w-sm">
        {isMinimized ? (
          <Button
            onClick={() => setIsMinimized(false)}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all animate-pulse"
            size="lg"
          >
            <span className="text-4xl">🤖</span>
          </Button>
        ) : (
          <Card className="border-sidebar-border shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 flex flex-row items-center justify-between rounded-t-lg">
              <div className="flex items-center gap-2">
                <div className="text-2xl">🤖</div>
                <CardTitle className="text-white text-base">
                  Leo
                  {isLeoWaiting && <span className="ml-2 animate-pulse">👂</span>}
                </CardTitle>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsMinimized(true)}
                className="h-8 w-8 p-0 hover:bg-white/20"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            </CardHeader>

            <CardContent className="space-y-3 pt-4">
              {!isSupported && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700 text-xs">
                    Speech recognition not supported. Use Chrome, Edge, or Safari.
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-700 text-xs">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <div className="p-3 bg-secondary/50 rounded-lg min-h-12">
                  <p className="text-xs text-muted-foreground">Status:</p>
                  <p className="text-sm font-medium">
                    {isListening ? "🔴 Listening..." : isLeoWaiting ? "🟢 Leo is ready!" : "👂 Say: Hey Leo"}
                  </p>
                </div>

                <div className="p-3 bg-secondary/50 rounded-lg min-h-12">
                  <p className="text-xs text-muted-foreground">You said:</p>
                  <p className="text-sm font-medium text-wrap break-words max-h-20 overflow-y-auto">
                    {transcript || "Nothing yet"}
                  </p>
                </div>
              </div>

              <div className="flex gap-1">
                <Button
                  onClick={isListening ? stopListening : startListening}
                  variant={isListening ? "destructive" : "default"}
                  className="flex-1 gap-1"
                  size="sm"
                  disabled={!isSupported}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-3 h-3" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Mic className="w-3 h-3" />
                      Listen
                    </>
                  )}
                </Button>

                <Button
                  onClick={toggleSpeech}
                  variant="outline"
                  size="sm"
                  disabled={!feedback || !("speechSynthesis" in window)}
                >
                  {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                </Button>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-2 rounded text-xs text-blue-700 space-y-1">
                <p><strong>🎤 Try saying:</strong></p>
                <p>"Hey Leo" - Wake up Leo</p>
                <p>"Dashboard" - Go to dashboard</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Full page version
  return (
    <div className="space-y-4">
      <Card className="border-sidebar-border">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <CardTitle className="flex items-center gap-3">
            <div className="text-4xl">🤖</div>
            <div>
              Leo - Your AI Assistant
              {isLeoWaiting && <div className="text-sm animate-pulse">👂 Leo is listening...</div>}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {!isSupported && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-700">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <div className="p-4 bg-secondary/50 rounded-lg min-h-20">
              <p className="text-sm text-muted-foreground">Leo's Status:</p>
              <p className="text-foreground font-medium text-lg">
                {isListening ? "🔴 Listening..." : isLeoWaiting ? "🟢 Leo is awake and ready!" : "👂 Say: Hey Leo"}
              </p>
            </div>

            <div className="p-4 bg-secondary/50 rounded-lg min-h-20">
              <p className="text-sm text-muted-foreground">You said:</p>
              <p className="text-foreground font-medium text-wrap break-words">
                {transcript || "Nothing yet"}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={isListening ? stopListening : startListening}
              variant={isListening ? "destructive" : "default"}
              className="flex-1 gap-2"
              size="lg"
              disabled={!isSupported}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  Start Listening
                </>
              )}
            </Button>

            <Button
              onClick={toggleSpeech}
              variant="outline"
              size="lg"
              disabled={!feedback || !("speechSynthesis" in window)}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>

            <Button
              onClick={clearTranscript}
              variant="outline"
              size="lg"
            >
              Clear
            </Button>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 p-4 rounded-lg space-y-2">
            <p className="font-semibold text-sm">🗣️ How to Use Leo:</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>✓ Say <strong>"Hey Leo"</strong> to wake me up</li>
              <li>✓ Say <strong>"Dashboard"</strong> - Go to dashboard</li>
              <li>✓ Say <strong>"Courses"</strong> - Open courses</li>
              <li>✓ Say <strong>"Quizzes"</strong> - Open quizzes</li>
              <li>✓ Say <strong>"Analytics"</strong> - View analytics</li>
              <li>✓ Say <strong>"Jobs"</strong> - Browse jobs</li>
              <li>✓ Say <strong>"Profile"</strong> - Go to profile</li>
              <li>✓ Say <strong>"Settings"</strong> - Open settings</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <p className="text-xs text-blue-700">
              <strong>💡 Tips:</strong> Speak clearly, use Chrome/Edge for best results. Leo listens globally for "Hey Leo"!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
