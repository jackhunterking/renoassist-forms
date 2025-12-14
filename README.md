# RenoAssist Forms

Basement renovation inquiry form for RenoAssist, deployed at `inquiry.renoassist.io`.

## Features

- 9-step basement renovation inquiry form
- Saves to Supabase database
- Sends data to Xano API for FlutterFlow integration
- Mobile-responsive design with RenoAssist branding

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS (via CDN)
- Supabase (database)
- Xano API integration

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Create a `.env` file with:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment

Deployed on Vercel with domain `inquiry.renoassist.io`.

## Xano Integration

Form submissions are sent to:
```
POST https://xewg-ezlq-ir6t.n2.xano.io/api:hv7Xacah/projects/create
```

Payload format matches the FlutterFlow app requirements with:
- `category: 1` (Basement)
- `answers` array with questionIDs 10, 11, 13
- Contact and location information
