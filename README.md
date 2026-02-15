This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Configuration

Application is configured using environment variables. An example environment file is included (`example.env`).

## Authentication

The application currently sits behind an authentication layer using Firebase. The following environment variables are required:

```bash

NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
```

## Pomodoro Timer Features

This application implements a basic Pomodoro timer with the following features:

-   **Configurable Timer Modes**: Switch between Pomodoro, Short Break, and Long Break sessions. Durations are currently set for development:
    -   Pomodoro: 10 seconds
    -   Short Break: 10 seconds
    -   Long Break: 30 seconds
-   **Manual Start/Pause**: Timers do not start automatically; you initiate and pause them manually.
-   **Pomodoro Cycle Tracking**: The application tracks completed Pomodoro sessions. After 3 Pomodoros, a Long Break is initiated; otherwise, a Short Break follows a Pomodoro.
-   **Notification Sound**: An audio notification plays when a timer session ends. (Requires `public/notification.mp3` to be present).
-   **Task Management**:
    -   Add new tasks to a list.
    -   Select a task to associate Pomodoro sessions with it.
    -   The number of Pomodoros completed for a selected task is recorded against it.
-   **Visual Feedback**:
    -   The currently active timer mode button (Pomodoro, Short Break, Long Break) is highlighted.
    -   Selected tasks in the list are visually highlighted with a distinct border.
    -   The text of the currently selected task is displayed above the task list for easy reference.
-   **Flat-file Storage**: Tasks are currently stored in a local `tasks.json` file at the project root. This file is automatically created if it doesn't exist.

### Usage

1.  **Start the development server** as described in "Getting Started".
2.  **Add tasks** using the input field and "Add" button below the timer.
3.  **Select a task** by clicking on it in the task list. The selected task will be highlighted, and its name will appear above the task list.
4.  **Start a Pomodoro** by clicking the "START" button.
5.  When a Pomodoro finishes, the application will automatically transition to the next break (Short or Long) based on the Pomodoro cycle rules. You will need to click "START" to begin the break.
6.  The `pomodoroCount` for the selected task will increment after each completed Pomodoro session.
7.  To switch modes manually, click the respective "Pomodoro", "Short Break", or "Long Break" buttons.
8.  Ensure you have an `notification.mp3` file in your `public` directory for the audio notification to work.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
