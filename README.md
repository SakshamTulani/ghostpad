# Ghostpad

Ghostpad is a modern, offline-first, local-first note-taking application built for speed and privacy. It leverages the power of Progressive Web App (PWA) technologies to provide a seamless experience whether you are online or offline, with robust syncing capabilities.

## Key Features

- **Offline-First**: Built with a "local-first" philosophy. Your data lives on your device and works perfectly without an internet connection.
- **Seamless Sync**: powered by **Dexie Cloud**, keeping your workspaces and notes synchronized across all your devices when you are online.
- **Rich Block Editor**: Utilizes **BlockNote** for a Notion-like block-based editing experience.
- **PWA Support**: Installable on desktop and mobile devices for a native app feel, powered by **Serwist**.
- **Modern UI**: A clean, beautiful interface built with **Shadcn UI** and **Tailwind CSS**.

## Tech Stack

This project is built using the latest web technologies:

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Database**: [Dexie.js](https://dexie.org/) & Dexie Cloud (IndexedDB wrapper)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Service Worker**: [Serwist](https://serwist.pages.dev/)
- **Package Manager**: [Bun](https://bun.sh/)

## Getting Started

First, ensure you have [Bun](https://bun.sh/) installed.

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/SakshamTulani/ghostpad.git
    cd ghostpad
    ```

2.  **Setup Sync:**

    This project uses Dexie Cloud for syncing. Run the following command to set up the environment variables and database connection:

    ```bash
    npx dexie-cloud create
    ```

3.  **Install dependencies:**

    ```bash
    bun install
    ```

4.  **Run the development server:**

    ```bash
    bun dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

- `bun dev`: Runs the development server.
- `bun build`: Builds the application for production.
- `bun start`: Starts the production server.
- `bun lint`: Runs ESLint to check for code quality issues.

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Dexie.js Documentation](https://dexie.org/docs/Tutorial/React)
- [BlockNote Documentation](https://www.blocknotejs.org/)

## License

This project is licensed under the MIT License.
