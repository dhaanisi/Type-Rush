"use client";
import { useState } from "react";
import InputBox from "./InputBox";
import Score from "./Score";

const words = ["react", "next", "javascript", "speed", "focus"];

export default function Game() {
    const [currentWord, setCurrentWord] = useState(words[0]);
    const [score, setScore] = useState(0);

    const handleCorrect = () => {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        setCurrentWord(randomWord);
        setScore(score + 1);
    };

    return (
        <div className="flex flex-col items-center gap-6 mt-20">
            <h1 className="text-3xl font-bold">{currentWord}</h1>

            <InputBox currentWord={currentWord} onCorrect={handleCorrect} />

            <Score score={score} />
        </div>
    );
}