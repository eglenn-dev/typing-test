'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"

const prompts = [
    "The quick brown fox jumps over the lazy dog",
    "To be or not to be, that is the question",
    "All that glitters is not gold",
    "A journey of a thousand miles begins with a single step",
    "Where there's a will, there's a way",
    "Look before you leap, but don't hesitate too long.",
    "Actions speak louder than words, so let your deeds do the talking.",
    "Better late than never, but strive for punctuality.",
    "Don't count your chickens before they hatch, as unforeseen circumstances can arise.",
    "Early to bed and early to rise, makes a man healthy, wealthy, and wise, according to Benjamin Franklin.",
    "Practice makes perfect, so continue honing your skills diligently.",
    "Two wrongs don't make a right; seeking revenge only perpetuates the cycle.",
    "The pen is mightier than the sword, demonstrating the power of communication.",
    "When in Rome, do as the Romans do, adapting to local customs and traditions.",
    "A picture is worth a thousand words, conveying complex emotions and narratives visually.",
    "Birds of a feather flock together, as people tend to gravitate towards like-minded individuals.",
    "Honesty is the best policy, fostering trust and building strong relationships.",
    "Necessity is the mother of invention, driving innovation and problem-solving.",
    "The early bird catches the worm, emphasizing the advantages of proactivity.",
    "Time and tide wait for no man, highlighting the importance of seizing opportunities.",
    "A stitch in time saves nine, advocating for preventative measures to avoid larger problems.",
    "Make hay while the sun shines, urging us to capitalize on favorable conditions.",
    "Variety is the spice of life, celebrating diversity and embracing new experiences.",
    "All's well that ends well, suggesting that a positive outcome can redeem past difficulties."
];

export default function SpeedTypingTest() {
    const [prompt, setPrompt] = useState('')
    const [userInput, setUserInput] = useState('')
    const [startTime, setStartTime] = useState<number | null>(null)
    const [endTime, setEndTime] = useState<number | null>(null)
    const [wpm, setWpm] = useState(0)
    const [accuracy, setAccuracy] = useState(100)
    const [isTestActive, setIsTestActive] = useState(false)
    const inputRef = useRef<HTMLTextAreaElement>(null)

    const getRandomPrompt = useCallback(() => {
        const randomIndex = Math.floor(Math.random() * prompts.length)
        return prompts[randomIndex]
    }, [])

    const startTest = useCallback(() => {
        setPrompt(getRandomPrompt())
        setUserInput('')
        setStartTime(Date.now())
        setEndTime(null)
        setWpm(0)
        setAccuracy(100)
        setIsTestActive(true)
        inputRef.current?.focus()
    }, [getRandomPrompt])

    const endTest = useCallback(() => {
        setEndTime(Date.now())
        setIsTestActive(false)
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const input = e.target.value
        setUserInput(input)

        const accuracyPercentage = calculateAccuracy(input, prompt)
        setAccuracy(accuracyPercentage)

        if (input.length >= prompt.length) {
            endTest()
        }
    }

    const calculateAccuracy = (input: string, prompt: string) => {
        const minLength = Math.min(input.length, prompt.length)
        let correctChars = 0
        for (let i = 0; i < minLength; i++) {
            if (input[i] === prompt[i]) {
                correctChars++
            }
        }
        return Math.round((correctChars / prompt.length) * 100)
    }

    useEffect(() => {
        if (endTime && startTime) {
            const timeInMinutes = (endTime - startTime) / 60000
            const wordsTyped = userInput.trim().split(/\s+/).length
            const calculatedWpm = Math.round(wordsTyped / timeInMinutes)
            setWpm(calculatedWpm)
        }
    }, [endTime, startTime, userInput])

    return (
        <Card className="card w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>Speed Typing Test</CardTitle>
                <CardDescription>Type the given prompt as quickly and accurately as you can</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {isTestActive ? (
                    <>
                        <div className="relative">
                            <textarea
                                ref={inputRef}
                                value={userInput}
                                onChange={handleInputChange}
                                className="testArea w-full h-32 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                disabled={!isTestActive}
                            />
                            <div
                                aria-hidden="true"
                                className="absolute top-2 left-2 pointer-events-none font-mono"
                            >
                                {prompt.split('').map((char, index) => (
                                    <span
                                        key={index}
                                        className={
                                            userInput[index] === undefined
                                                ? ''
                                                : userInput[index] === char
                                                    ? 'text-green-500'
                                                    : 'text-red-500'
                                        }
                                    >
                                        {char}
                                    </span>
                                ))}
                            </div>
                        </div>
                        {isTestActive && (
                            <div className="mt-4 flex justify-between text-sm">
                                <span>Progress: {Math.round((userInput.length / prompt.length) * 100)}%</span>
                                <span>Accuracy: {accuracy}%</span>
                            </div>
                        )}
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                                style={{ width: `${(userInput.length / prompt.length) * 100}%` }}
                                role="progressbar"
                                aria-valuenow={(userInput.length / prompt.length) * 100}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            ></div>
                        </div>
                    </>
                ) : (
                    <div className="text-center">
                        <p className="text-xl font-semibold mb-4">
                            {endTime ? 'Test completed!' : 'Click "Start Test" to begin'}
                        </p>
                        {endTime && (
                            <div className="space-y-2">
                                <p>Your speed: {wpm} WPM</p>
                                <p>Accuracy: {accuracy}%</p>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-center">
                <Button onClick={startTest} disabled={isTestActive}>
                    {endTime ? 'Restart Test' : 'Start Test'}
                </Button>
            </CardFooter>
        </Card>
    )
}