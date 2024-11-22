'use client'
import React, { useState, useEffect } from 'react';
import styles from './styles/results.module.css';

interface Result {
    wpm: number;
    accuracy: number;
    time: string;
}

export default function Results() {
    const [results, setResults] = useState<Result[]>([]);

    useEffect(() => {
        const history = localStorage.getItem('typingTestResult');
        if (history) {
            setResults(JSON.parse(history));
        }
    }, []);

    return (
        <div className={styles.resultsArea}>
            <h3>History</h3>
            <ul>
                {results.length ? results.slice().reverse().map((result, index) => (
                    <li key={index}>
                        <p>{result.wpm} wpm / {result.accuracy}%</p>
                    </li>
                )) : (
                    <p>No previous results</p>
                )}
            </ul>
        </div>
    );
}