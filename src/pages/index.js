// pages/index.js

import { useState, useEffect, useRef } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [timerLabel, setTimerLabel] = useState('Session');
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const beepRef = useRef(null);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const startStopTimer = () => {
    if (isRunning) {
      clearInterval(intervalId);
      setIsRunning(false);
    } else {
      const id = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 0) {
            beepRef.current.play(); // Play beep sound
            if (timerLabel === 'Session') {
              setTimerLabel('Break');
              return breakLength * 60;
            } else {
              setTimerLabel('Session');
              return sessionLength * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
      setIntervalId(id);
      setIsRunning(true);
    }
  };

  const resetTimer = () => {
    clearInterval(intervalId);
    setIsRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setTimerLabel('Session');
    beepRef.current.pause();
    beepRef.current.currentTime = 0; // Reset beep sound
  };

  useEffect(() => {
    setTimeLeft(sessionLength * 60);
  }, [sessionLength]);

  useEffect(() => {
    if (isRunning) {
      document.title = formatTime(timeLeft);
    } else {
      document.title = 'Pomodoro Timer';
    }
  }, [timeLeft, isRunning]);

  return (
    <div id="pomodoro-timer" className={styles.container}>
      <div id="break-label" className={styles.label}>Break Length</div>
      <div className={styles.controlPanel}>
        <button id="break-decrement" onClick={() => setBreakLength(Math.max(breakLength - 1, 1))}>-</button>
        <span id="break-length" className={styles.length}>{breakLength}</span>
        <button id="break-increment" onClick={() => setBreakLength(Math.min(breakLength + 1, 60))}>+</button>
      </div>

      <div id="session-label" className={styles.label}>Session Length</div>
      <div className={styles.controlPanel}>
        <button id="session-decrement" onClick={() => setSessionLength(Math.max(sessionLength - 1, 1))}>-</button>
        <span id="session-length" className={styles.length}>{sessionLength}</span>
        <button id="session-increment" onClick={() => setSessionLength(Math.min(sessionLength + 1, 60))}>+</button>
      </div>

      <div id="timer-label" className={styles.timerLabel}>{timerLabel}</div>
      <div id="time-left" className={styles.timeLeft}>{formatTime(timeLeft)}</div>

      <div className={styles.controlPanel}>
        <button id="start_stop" className={styles.startStopButton} onClick={startStopTimer}>{isRunning ? 'Pause' : 'Start'}</button>
        <button id="reset" className={styles.resetButton} onClick={resetTimer}>Reset</button>
      </div>

      <audio
        id="beep"
        ref={beepRef}
        src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
        className={styles.audioHidden}
        preload="auto"
      />
    </div>
  );
}
