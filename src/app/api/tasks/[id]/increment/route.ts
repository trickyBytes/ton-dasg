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
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function saveTasks(tasks: Task[]) {
  await fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2));
}

export async function PUT(request: Request, context: { params: { id: string } }) {

  const { id } = context.params;
  const tasks = await getTasks();
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  tasks[taskIndex].pomodoros += 1;
  await saveTasks(tasks);

  return NextResponse.json(tasks[taskIndex]);
}
