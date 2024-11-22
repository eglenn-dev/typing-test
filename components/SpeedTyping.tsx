'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { prompts } from "@/components/prompts";

interface SpeedTypingTestProps {
    renderResults: () => void;
}

export default function SpeedTypingTest({ renderResults }: SpeedTypingTestProps) {
    const [prompt, setPrompt] = useState('')
    const [userInput, setUserInput] = useState('')
    const [startTime, setStartTime] = useState<number | null>(null)
    const [endTime, setEndTime] = useState<number | null>(null)
    const [wpm, setWpm] = useState(0)
    const [accuracy, setAccuracy] = useState(100)
    const [isTestActive, setIsTestActive] = useState(false)
    const [savedResults, setSavedResults] = useState(false)
    const inputRef = useRef<HTMLTextAreaElement>(null)

    const getRandomPrompt = useCallback(() => {
        const randomIndex = Math.floor(Math.random() * prompts.length)
        return prompts[randomIndex]
    }, [])

    const startTest = useCallback(() => {
        setPrompt(getRandomPrompt())
        setUserInput('')
        setEndTime(null)
        setWpm(0)
        setAccuracy(100)
        setIsTestActive(true)
        setSavedResults(false)
        inputRef.current?.focus()
    }, [getRandomPrompt])

    const endTest = useCallback(() => {
        setEndTime(Date.now())
        setIsTestActive(false)
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const input = e.target.value
        if (input.length === 1) {
            console.log("Timer started")
            setStartTime(Date.now())
        }
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
            if (!savedResults) {
                const testResult = {
                    wpm: calculatedWpm,
                    accuracy,
                    date: new Date().toISOString(),
                }
                const userResults = JSON.parse(localStorage.getItem('typingTestResult') || '[]');
                userResults.push(testResult);
                localStorage.setItem('typingTestResult', JSON.stringify(userResults));
                renderResults();
                setSavedResults(true);
            }
        }
    }, [endTime, startTime, userInput, accuracy, wpm, savedResults, renderResults])

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
                                autoFocus
                                spellCheck={false}
                                style={{ resize: 'none', color: 'transparent' }}
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