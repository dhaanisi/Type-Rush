"use client";
import { useEffect, useState, useCallback } from "react";
import Score from "./Score";
import FallingWord from "./FallingWord";

const words = [
    "react", "nextjs", "typescript", "tailwind", "vercel",
    "developer", "frontend", "backend", "fullstack", "coding",
    "javascript", "function", "variable", "component", "interface",
    "deployment", "performance", "testing", "design", "creative"
];

interface FallingWordData {
    text: string;
    top: number;
    left: number;
    id: number;
}

export default function Game() {
    const [fallingWords, setFallingWords] = useState<FallingWordData[]>([]);
    const [input, setInput] = useState("");
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [speedMultiplier, setSpeedMultiplier] = useState(1);

    const startGame = () => {
        setScore(0);
        setLives(3);
        setFallingWords([]);
        setGameStarted(true);
        setGameOver(false);
        setSpeedMultiplier(1);
    };

    // spawn new words
    useEffect(() => {
        if (!gameStarted || gameOver) return;

        const interval = setInterval(() => {
            const newWord: FallingWordData = {
                text: words[Math.floor(Math.random() * words.length)],
                top: 0,
                left: Math.random() * 80 + 10, // Keep within 10% to 90%
                id: Date.now(),
            };

            setFallingWords((prev) => [...prev, newWord]);
            
            // Gradually increase speed
            setSpeedMultiplier(prev => Math.min(prev + 0.05, 3));
        }, Math.max(2000 / speedMultiplier, 800));

        return () => clearInterval(interval);
    }, [gameStarted, gameOver, speedMultiplier]);

    // move words down
    useEffect(() => {
        if (!gameStarted || gameOver) return;

        const interval = setInterval(() => {
            setFallingWords((prev) =>
                prev.map((word) => ({
                    ...word,
                    top: word.top + (2 * speedMultiplier),
                }))
            );
        }, 50);

        return () => clearInterval(interval);
    }, [gameStarted, gameOver, speedMultiplier]);

    // check if words hit bottom
    useEffect(() => {
        if (!gameStarted || gameOver) return;

        fallingWords.forEach((word) => {
            if (word.top > 450) {
                setLives((l) => {
                    const newLives = l - 1;
                    if (newLives <= 0) {
                        setGameOver(true);
                    }
                    return newLives;
                });

                setScore((s) => Math.max(0, s - 5));

                setFallingWords((prev) =>
                    prev.filter((w) => w.id !== word.id)
                );
            }
        });
    }, [fallingWords, gameStarted, gameOver]);

    // typing logic
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!gameStarted || gameOver) return;

        const value = e.target.value;
        setInput(value);

        const matched = fallingWords.find((w) => w.text === value.toLowerCase().trim());

        if (matched) {
            setScore((s) => s + 5);
            setFallingWords((prev) =>
                prev.filter((w) => w.id !== matched.id)
            );
            setInput("");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white p-4 font-sans focus:outline-none">
            <h1 className="text-4xl font-extrabold mb-8 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                TYPE RUSH
            </h1>

            <div className="relative w-full max-w-2xl h-[500px] border border-white/10 bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/10">
                {/* Game Elements */}
                {gameStarted && !gameOver ? (
                    <>
                        {fallingWords.map((word) => (
                            <FallingWord key={word.id} word={word.text} top={word.top} left={word.left} />
                        ))}

                        <div className="absolute top-6 left-8">
                            <Score score={score} />
                        </div>

                        <div className="absolute top-6 right-8 text-xl font-medium tracking-wide">
                            <span className="text-red-500 mr-2">{"❤️".repeat(lives)}</span>
                            <span className="text-white/40 ml-2">x {lives}</span>
                        </div>

                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full px-12">
                            <input
                                autoFocus
                                value={input}
                                onChange={handleChange}
                                className="w-full bg-white/10 border border-white/20 px-8 py-4 rounded-2xl text-2xl text-center outline-none focus:border-blue-500/50 transition-all placeholder:text-white/20"
                                placeholder="Type fast..."
                            />
                        </div>
                    </>
                ) : (
                    /* Start / Game Over Screen */
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-50">
                        {gameOver ? (
                            <div className="text-center">
                                <h2 className="text-5xl font-black mb-4 text-red-500 uppercase italic">Game Over</h2>
                                <p className="text-white/60 text-xl mb-8">Final Score: <span className="text-white font-bold">{score}</span></p>
                            </div>
                        ) : (
                            <div className="text-center">
                                <h2 className="text-3xl font-bold mb-2">Ready to test your speed?</h2>
                                <p className="text-white/40 mb-10">Match words to score +5 points.</p>
                            </div>
                        )}
                        <button
                            onClick={startGame}
                            className="bg-white text-black px-12 py-4 rounded-full font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
                        >
                            {gameOver ? "TRY AGAIN" : "START GAME"}
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-8 text-white/20 text-sm uppercase tracking-[0.2em]">
                Built with precision
            </div>
        </div>
    );
}