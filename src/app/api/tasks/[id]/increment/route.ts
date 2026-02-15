import { NextResponse, NextRequest } from 'next/server';
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(request: NextRequest, context: any) {
  const id = context.params.id;
  const tasks = await getTasks();
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  tasks[taskIndex].pomodoros += 1;
  await saveTasks(tasks);

  return NextResponse.json(tasks[taskIndex]);
}
