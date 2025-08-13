# Travel Itinerary Generator (Frontend)

A modern React + TypeScript web app for generating, managing, and viewing AI-powered travel itineraries. Built with Vite, Tailwind CSS, and component-based architecture.

## Features
- User authentication (login/register)
- Dashboard with statistics and itinerary management
- Create new itineraries using AI
- View, delete, and manage itineraries
- Responsive, clean UI with Tailwind CSS

## Tech Stack
- React + TypeScript
- Vite
- Tailwind CSS
- React Router
- Context API for auth
- API integration (expects backend at `http://localhost:8000`)

## Project Structure
```
project/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
├── public/
│   └── travel-icon.svg
└── src/
    ├── App.tsx
    ├── index.css
    ├── main.tsx
    ├── components/
    │   ├── ItineraryCard.tsx
    │   ├── LoadingSpinner.tsx
    │   ├── Navbar.tsx
    │   └── ProtectedRoute.tsx
    ├── contexts/
    │   └── AuthContext.tsx
    ├── pages/
    │   ├── Dashboard.tsx
    │   ├── Generate.tsx
    │   ├── Home.tsx
    │   ├── ItineraryDetail.tsx
    │   ├── Login.tsx
    │   └── Register.tsx
    ├── services/
    │   └── api.ts
    └── types/
        └── index.ts
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Backend API running at `http://localhost:8000`

### Installation
1. Clone the repo:
   ```sh
   git clone <repo-url>
   cd project
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Environment Variables

You must set the API base URL using a Vite environment variable in a `.env` file at the project root:

```
VITE_BASE_URL=http://localhost:8000
```

This variable is required and is used by the frontend to connect to your backend API. You can change it to point to any backend URL as needed.

**Note:** Only variables prefixed with `VITE_` are exposed to the frontend in Vite projects. Do not use `API_BASE_URL` or any other name without the `VITE_` prefix.

In your code, always access it as:

```ts
const API_BASE_URL = import.meta.env.VITE_BASE_URL;
```

## Customization
- **Tailwind Colors:** Edit `tailwind.config.js` to change theme colors.
- **API Endpoints:** Update `src/services/api.ts` for backend changes.

## License
MIT

---

Feel free to contribute or open issues for improvements!
