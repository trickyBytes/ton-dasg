"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";

export default function Home() {
  const timerModes = useMemo(() => ({
    pomodoro: 60 * 20, // 10 seconds for dev work
    shortBreak: 60 * 5, // 10 seconds for dev work
    longBreak: 60 * 15, // 30 seconds for dev work
  }), []);

  const [timerMode, setTimerMode] = useState("pomodoro");
  const [time, setTime] = useState(timerModes[timerMode as keyof typeof timerModes]);
  const [isActive, setIsActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [pomodoroCount, setPomodoroCount] = useState(0);

  type Task = {
    id: string;
    text: string;
    completed: boolean;
    pomodoros: number;
  };

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      setTasks(data);
    };
    fetchTasks();
  }, []);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: newTaskText }),
    });

    if (response.ok) {
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      setNewTaskText('');
    }
  };

  const incrementPomodoro = useCallback(async () => {
    if (!selectedTaskId) return;

    const response = await fetch(`/api/tasks/${selectedTaskId}/increment`, {
      method: 'PUT',
    });

    if (response.ok) {
      const updatedTask = await response.json();
      setTasks(tasks.map(task => task.id === selectedTaskId ? updatedTask : task));
    }
  }, [selectedTaskId, setTasks, tasks]);

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
        incrementPomodoro();
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
  }, [isActive, time, timerMode, pomodoroCount, resetTimer, selectedTaskId, incrementPomodoro]);

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
        {selectedTaskId && (
          <p className="mb-2">Selected task: {tasks.find(task => task.id === selectedTaskId)?.text}</p>
        )}
      </div>
      <div className="mt-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-left">Tasks</h2>
          {/* Placeholder for task menu if needed */}
        </div>
        <div className="bg-gray-800/50 p-4 rounded-lg text-left">
          {tasks.length > 0 ? (
            <ul>
              {tasks.map((task) => (
                <li
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className={`flex items-center justify-between mb-2 p-2 rounded-lg cursor-pointer ${selectedTaskId === task.id ? 'bg-gray-700 border-l-4 border-red-500' : ''
                    }`}
                >
                  <div className="flex items-center">
                    <input type="checkbox" checked={task.completed} readOnly className="mr-2" />
                    <span>{task.text}</span>
                  </div>
                  <span className="text-gray-400">{task.pomodoros || 0}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No tasks yet. Add one below!</p>
          )}
        </div>
        <form onSubmit={addTask} className="mt-4 flex">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Add a new task"
            className="bg-gray-700 text-white rounded-l-lg p-2 flex-grow"
          />
          <button type="submit" className="bg-red-500 text-white font-bold rounded-r-lg px-4">
            Add
          </button>
        </form>
      </div>
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />
    </div>
  );
}
