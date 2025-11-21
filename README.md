# ElimuNova

ElimuNova is a modern, fast web application for delivering interactive learning content. It combines a Vite + React + TypeScript frontend with shadcn-ui and Tailwind CSS to provide a responsive, accessible learning interface.

Features

- Create and browse courses and lessons
- Rich content rendering (text, images, video, quizzes)
- Responsive UI built with shadcn-ui + Tailwind CSS
- Fast development experience with Vite and TypeScript

Demo & deploy

- Deployed application: REPLACE_WITH_DEPLOYED_APP_URL
- 5–10 minute demo video: REPLACE_WITH_VIDEO_URL

Screenshots

Add screenshots in the repository under /docs/screenshots and reference them here. Example:

![Course list](/docs/screenshots/course-list.png)

![Lesson view](/docs/screenshots/lesson-view.png)

Setup (local development)

Prerequisites

- Node.js 16 or newer
- npm (or pnpm/yarn)

Clone and run

```sh
# 1. Clone the repo
git clone https://github.com/psychokeed/ElimuNova.git
cd ElimuNova

# 2. Install dependencies
npm install

# 3. Create a .env file (if required)
# Copy .env.example to .env and edit any required variables
cp .env.example .env || true

# 4. Start the development server
npm run dev

# 5. Build for production
npm run build

# 6. Preview production build locally
npm run preview
```

Notes

- Replace the placeholder URLs above with your actual deployed app URL and the demo video link.
- Add screenshots to /docs/screenshots and commit them; they will render above.

Technologies

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

Contributing

Contributions are welcome. Please open issues or pull requests with proposed changes.

License

Specify your project license here (e.g., MIT).