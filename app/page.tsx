'use client'
import React, { useState } from 'react';
import SpeedTypingTest from '@/components/SpeedTyping'
import Results from "@/components/Results";
import styles from './page.module.css';

export default function Home() {
  const [resultsRender, setResultsRender] = useState(0);

  const renderResults = () => {
    setResultsRender(resultsRender + 1);
  }

  return (
    <main className={`${styles.mainContainer} container mx-auto p-4`}>
      <div></div>
      <SpeedTypingTest renderResults={renderResults} />
      <Results key={resultsRender} />
    </main>
  )
}