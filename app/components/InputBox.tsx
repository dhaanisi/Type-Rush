"use client";
import { useState } from "react";

export default function InputBox({ currentWord, onCorrect }: any) {
    const [input, setInput] = useState("");

    const handleChange = (e: any) => {
        const value = e.target.value;
        setInput(value);

        if (value === currentWord) {
            onCorrect();
            setInput("");
        }
    };

    return (
        <input
            value={input}
            onChange={handleChange}
            className="border px-4 py-2 text-lg rounded"
            placeholder="Type here..."
        />
    );
}