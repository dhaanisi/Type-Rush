"use client";

interface FallingWordProps {
    word: string;
    top: number;
    left: number;
}

export default function FallingWord({ word, top, left }: FallingWordProps) {
    return (
        <div
            className="absolute transition-all duration-100 ease-linear pointer-events-none"
            style={{ 
                top: `${top}px`, 
                left: `${left}%`,
                transform: "translateX(-50%)"
            }}
        >
            <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md shadow-lg shadow-blue-500/5">
                <span className="text-xl font-black tracking-wider bg-clip-text text-transparent bg-linear-to-b from-white to-white/60 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                    {word}
                </span>
            </div>
        </div>
    );
}
