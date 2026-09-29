# DormHunt Frontend

React + Vite + TypeScript frontend for the DormHunt student housing platform.

## Project Structure

```
src/
├── api/              # API client and services
│   ├── client.ts     # Axios instance configuration
│   └── services/     # API service modules (dorms, messages, reports)
├── pages/            # Page components (routing)
├── components/       # Reusable UI components (WIP)
├── store/            # Zustand state management
├── styles/           # Global styles and design tokens
└── App.tsx           # Root app with routing
```

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: Zustand
- **Styling**: CSS (design tokens)

## Setup

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Create `.env`** from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Update `VITE_API_URL` to match your backend server.

3. **Run dev server**:
   ```bash
   npm run dev
   ```
   Frontend will be available at `http://localhost:5173` (default Vite port).

## Development

### Adding Pages

Create new page components in `src/pages/` and add routes to `src/App.tsx`:

```tsx
import { MyPage } from './pages/MyPage';

<Route path="/my-page" element={<MyPage />} />
```

### Using API Services

Each API resource has a service in `src/api/services/`:

```tsx
import { dormService } from '@/api';

const dorms = await dormService.listApproved();
const dorm = await dormService.getById(id);
```

### State Management

Use Zustand stores for persistent state:

```tsx
import { useAuthStore } from '@/store/auth';

const { userId, logout } = useAuthStore();
```

### Design Tokens

Color and spacing tokens are in `src/styles/tokens.ts` and available as CSS variables:

```css
/* In CSS */
color: var(--color-primary-600);
padding: var(--space-4);

/* Or import TS tokens */
import { colors, spacing } from '@/styles/tokens';
```

## Build & Deploy

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Component Library (TODO)

Planned base components:
- Button
- Input / Textarea
- Card
- Modal
- Navigation
- Sidebar
- Table
- Pagination

See `src/components/` for implementation as components are added.

## Pages to Implement

1. ✓ HomePage (stubs)
2. ✓ SearchPage
3. ✓ ListingDetailPage
4. ✓ LoginPage
5. ✓ ManageListingsPage (Owner)
6. ✓ CompareListingsPage
7. ✓ FavoritesPage
8. ✓ AdminDashboardPage
9. ✓ FindRoommatePage
10. ✓ OwnerDashboardPage

## Next Steps

1. Build base UI components using design tokens
2. Implement form validation and error handling
3. Add Listing search/filter logic
4. Integrate image upload (Supabase storage)
5. Add authentication flow
6. Build dashboards with charts and tables
7. E2E tests with Playwright


The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
