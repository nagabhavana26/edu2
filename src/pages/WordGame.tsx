import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy, ArrowRight, RefreshCcw, Star, Brain, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const WORDS = [
    { word: "ALGORITHM", hint: "A step-by-step procedure for solving a problem." },
    { word: "DATABASE", hint: "An organized collection of structured information." },
    { word: "FRONTEND", hint: "The part of a website that users interact with." },
    { word: "BACKEND", hint: "The 'server-side' part of an application." },
    { word: "VARIABLE", hint: "A storage location paired with an associated symbolic name." },
    { word: "FUNCTION", hint: "A block of code designed to perform a particular task." },
    { word: "REACT", hint: "A popular JavaScript library for building user interfaces." },
    { word: "TYPESCRIPT", hint: "A superset of JavaScript that adds static typing." },
    { word: "SUPABASE", hint: "An open source Firebase alternative." },
    { word: "VITE", hint: "A build tool that aims to provide a faster development experience." },
];

const WordGame = () => {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [scrambledWord, setScrambledWord] = useState("");
    const [userInput, setUserInput] = useState("");
    const [score, setScore] = useState(0);
    const [isGameFinished, setIsGameFinished] = useState(false);
    const [attempts, setAttempts] = useState(0);

    useEffect(() => {
        scrambleWord(WORDS[currentWordIndex].word);
    }, [currentWordIndex]);

    const scrambleWord = (word: string) => {
        const scrambled = word
            .split("")
            .sort(() => Math.random() - 0.5)
            .join("");

        // Ensure it's not the same as the original
        if (scrambled === word && word.length > 1) {
            scrambleWord(word);
            return;
        }
        setScrambledWord(scrambled);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const correctWord = WORDS[currentWordIndex].word;

        if (userInput.toUpperCase() === correctWord) {
            const points = Math.max(10 - attempts, 2);
            setScore(score + points);
            toast.success(`Correct! You earned ${points} points.`);

            if (currentWordIndex < WORDS.length - 1) {
                setCurrentWordIndex(currentWordIndex + 1);
                setUserInput("");
                setAttempts(0);
            } else {
                setIsGameFinished(true);
            }
        } else {
            setAttempts(attempts + 1);
            toast.error("Incorrect! Try again.");
        }
    };

    const restartGame = () => {
        setCurrentWordIndex(0);
        setScore(0);
        setIsGameFinished(false);
        setUserInput("");
        setAttempts(0);
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-xl font-bold text-foreground">EduFlow</span>
                    </Link>
                    <Link to="/auth">
                        <Button variant="ghost">Get Started</Button>
                    </Link>
                </div>
            </nav>

            <main className="container max-w-4xl pt-32 pb-12 px-4 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                            <Brain size={32} />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground tracking-tight">Word Challenge</h1>
                    </div>
                    <p className="text-lg text-muted-foreground">Unscramble the educational terms to test your knowledge!</p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {!isGameFinished ? (
                        <motion.div
                            key="game"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <Card className="border-2 border-border shadow-xl overflow-hidden bg-card">
                                <CardHeader className="bg-primary text-primary-foreground flex flex-row justify-between items-center space-y-0">
                                    <div>
                                        <CardTitle className="text-xl">Level {currentWordIndex + 1}/{WORDS.length}</CardTitle>
                                        <CardDescription className="text-primary-foreground/80">Score: {score}</CardDescription>
                                    </div>
                                    <div className="flex gap-1 text-yellow-500">
                                        <Star fill="currentColor" size={20} />
                                        <Star fill="currentColor" size={20} />
                                        <Star fill="currentColor" size={20} />
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-12 pb-12 px-8 text-center">
                                    <motion.div
                                        key={scrambledWord}
                                        initial={{ letterSpacing: "0.2em", opacity: 0 }}
                                        animate={{ letterSpacing: "0.5em", opacity: 1 }}
                                        className="text-4xl md:text-5xl font-black text-foreground mb-12 uppercase tracking-[0.5em] break-words"
                                    >
                                        {scrambledWord}
                                    </motion.div>

                                    <div className="bg-secondary/50 p-4 rounded-xl mb-8">
                                        <p className="text-muted-foreground italic">
                                            <span className="font-bold text-primary not-italic mr-2">Hint:</span>
                                            {WORDS[currentWordIndex].hint}
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
                                        <Input
                                            value={userInput}
                                            onChange={(e) => setUserInput(e.target.value)}
                                            placeholder="Type your answer here..."
                                            className="text-lg h-12 border-2 focus-visible:ring-primary"
                                            autoFocus
                                        />
                                        <Button type="submit" className="h-12 px-8 font-bold">
                                            Check
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="finish"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center"
                        >
                            <Card className="border-2 border-border shadow-2xl bg-card">
                                <CardContent className="py-16">
                                    <div className="flex justify-center mb-8">
                                        <div className="relative">
                                            <motion.div
                                                animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
                                                transition={{ repeat: Infinity, duration: 2 }}
                                                className="text-yellow-500"
                                            >
                                                <Trophy size={120} />
                                            </motion.div>
                                        </div>
                                    </div>
                                    <h2 className="text-3xl font-bold text-foreground mb-2">Challenge Complete!</h2>
                                    <p className="text-xl text-muted-foreground mb-8">You achieved a score of <span className="text-primary font-black text-4xl">{score}</span></p>

                                    <div className="flex gap-4 justify-center">
                                        <Button onClick={restartGame} variant="outline" className="flex gap-2 text-lg px-8 h-12 border-2">
                                            <RefreshCcw size={20} /> Play Again
                                        </Button>
                                        <Button onClick={() => window.location.href = '/dashboard'} className="text-lg px-8 h-12 flex gap-2">
                                            Dashboard <ArrowRight size={20} />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <footer className="py-8 px-6 border-t border-border mt-auto">
                <div className="container mx-auto text-center text-muted-foreground">
                    <p>© 2024 EduFlow. Real-time education platform.</p>
                </div>
            </footer>
        </div>
    );
};

export default WordGame;
