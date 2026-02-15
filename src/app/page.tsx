"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export default function Home() {
  const timerModes = {
    pomodoro: 10, // 10 seconds for dev work
    shortBreak: 10, // 10 seconds for dev work
    longBreak: 30, // 30 seconds for dev work
  };

  const [timerMode, setTimerMode] = useState("pomodoro");
  const [time, setTime] = useState(timerModes[timerMode as keyof typeof timerModes]);
  const [isActive, setIsActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [pomodoroCount, setPomodoroCount] = useState(0);

  const resetTimer = useCallback((mode: keyof typeof timerModes, autoStart = false) => {
    setTimerMode(mode);
    setTime(timerModes[mode]);
    setIsActive(autoStart);
  }, [timerModes]);


  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
      if (interval) {
        clearInterval(interval);
      }
      audioRef.current?.play();

      if (timerMode === 'pomodoro') {
        const newPomodoroCount = pomodoroCount + 1;
        setPomodoroCount(newPomodoroCount);
        if (newPomodoroCount % 3 === 0) {
          resetTimer('longBreak', false);
        } else {
          resetTimer('shortBreak', false);
        }
      } else { // shortBreak or longBreak
        resetTimer('pomodoro', false);
      }
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, time, timerMode, pomodoroCount, resetTimer]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center p-4 text-center">
      <div className="bg-red-500/10 p-8 rounded-lg w-full max-w-md">
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => resetTimer("pomodoro")}
            className={`${timerMode === "pomodoro" ? "bg-red-500" : ""
              } text-white font-bold py-2 px-4 rounded`}
          >
            Pomodoro
          </button>
          <button
            onClick={() => resetTimer("shortBreak")}
            className={`${timerMode === "shortBreak" ? "bg-red-500" : ""
              } text-white font-bold py-2 px-4 rounded`}
          >
            Short Break
          </button>
          <button
            onClick={() => resetTimer("longBreak")}
            className={`${timerMode === "longBreak" ? "bg-red-500" : ""
              } text-white font-bold py-2 px-4 rounded`}
          >
            Long Break
          </button>
        </div>
        <div className="text-8xl font-bold mb-8">{formatTime(time)}</div>
        <div className="mb-8">
          <button
            onClick={toggleTimer}
            className="bg-white text-red-500 font-bold py-4 px-12 rounded-lg text-2xl"
          >
            {isActive ? "PAUSE" : "START"}
          </button>
        </div>
      </div>
      <div className="mt-8 w-full max-w-md text-gray-400 text-left">
        <p className="mb-2">Pomodoros completed: {pomodoroCount}</p>
        {timerMode !== 'pomodoro' && (
          <p className="mb-2">Current mode: {timerMode === 'shortBreak' ? 'Short Break' : 'Long Break'}</p>
        )}
      </div>
      <div className="mt-8 w-full max-w-md">
        <h2 className="text-xl font-bold text-left mb-4">Tasks</h2>
        <div className="bg-gray-800/50 p-4 rounded-lg text-left">
          Task list placeholder
        </div>
      </div>
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />
    </div>
  );
}
