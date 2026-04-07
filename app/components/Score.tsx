export default function Score({ score }: any) {
    return (
        <div className="text-xl">
            Score: <span className="font-bold">{score}</span>
        </div>
    );
}