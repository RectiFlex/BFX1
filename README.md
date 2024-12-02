# BlockFix

A professional property management and maintenance platform.

## Deployment

This project is configured for deployment on Netlify.

### Deploy with Netlify

1. Fork or clone this repository
2. Create a new site in Netlify
3. Connect to your repository
4. Configure the following environment variables in Netlify's dashboard:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_APP_NAME`
   - `VITE_APP_URL`
   - `VITE_ENABLE_ANALYTICS`
   - `VITE_MAINTENANCE_MODE`

5. Deploy! Netlify will automatically detect the build settings from netlify.toml

### Development

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Features

- Property Management
- Maintenance Work Orders
- Personnel Management
- Analytics Dashboard
- Financial Reporting
- Smart Contract Integration

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Firebase Authentication
- Ethers.js
- Vite