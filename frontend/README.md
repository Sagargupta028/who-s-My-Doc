# Who's My Doc - Frontend

## Environment Configuration

This frontend application uses environment variables to configure API endpoints for different environments (development, staging, production).

### Setup Instructions

1. **Create Environment File**
   ```bash
   cp .env.example .env
   ```

2. **Configure Environment Variables**
   Edit the `.env` file in the frontend root directory:
   ```env
   # API Base URL - Change this for different environments
   VITE_API_BASE_URL=http://localhost:3000

   # Development settings
   VITE_NODE_ENV=development
   ```

### Environment Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000` | `https://api.whosmydoc.com` |
| `VITE_NODE_ENV` | Environment mode | `development` | `production` |

### Different Environments

#### Development
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_NODE_ENV=development
```

#### Staging
```env
VITE_API_BASE_URL=https://staging-api.whosmydoc.com
VITE_NODE_ENV=staging
```

#### Production
```env
VITE_API_BASE_URL=https://api.whosmydoc.com
VITE_NODE_ENV=production
```

### API Configuration

The application uses a centralized API configuration located in `src/config/api.js`. This file:

- Reads environment variables using `import.meta.env`
- Provides centralized endpoint definitions
- Ensures consistent API URL management across the application

### Usage

All API calls in the application now use the configured endpoints:

```javascript
import { API_ENDPOINTS } from '../config/api';

// Instead of: axios.post('http://localhost:3000/login', data)
// Use: axios.post(API_ENDPOINTS.LOGIN, data)
```

### Development

1. Install dependencies: `npm install`
2. Configure environment: Copy and edit `.env` file
3. Start development server: `npm run dev`

### Deployment

For deployment, ensure the correct `VITE_API_BASE_URL` is set for your target environment before building the application.

```bash
npm run build
```

The built application will use the environment variables configured at build time.
