import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

type Task = {
  id: string;
  text: string;
  completed: boolean;
  pomodoros: number;
};

const tasksFilePath = path.join(process.cwd(), 'tasks.json');

async function getTasks(): Promise<Task[]> {
  try {
    const data = await fs.readFile(tasksFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: string }).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function saveTasks(tasks: Task[]) {
  await fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2));
}

export async function GET() {
  const tasks = await getTasks();
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const { text } = await request.json();
  if (!text) {
    return NextResponse.json({ error: 'Text is required' }, { status: 400 });
  }

  const tasks = await getTasks();
  const newTask: Task = {
    id: Date.now().toString(),
    text,
    completed: false,
    pomodoros: 0,
  };

  tasks.push(newTask);
  await saveTasks(tasks);

  return NextResponse.json(newTask, { status: 201 });
}
