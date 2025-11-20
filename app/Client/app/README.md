# Vestimenta - Luxury Fashion E-commerce

A premium e-commerce experience for high-end fashion, featuring a dark/gold aesthetic, user authentication, and shopping cart functionality. Built with React, TypeScript, Vite, and Tailwind CSS.

## Prerequisites

- Node.js (v18 or higher)
- npm (included with Node.js)

## Getting Started

1.  **Install Dependencies**

    ```bash
    npm install
    ```

2.  **Start Development Server**

    ```bash
    npm run dev
    ```
    
    Open `http://localhost:5173` in your browser.

## Building for Production

To create a production-ready build:

```bash
npm run build
```

This will compile the application into the `dist` folder. The output is optimized, minified, and ready to be deployed to any static hosting provider (Vercel, Netlify, AWS S3, etc.).

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

- **`/components`**: Reusable UI components (Layouts, Shared, etc.)
- **`/context`**: React Context providers (Auth, Cart)
- **`/pages`**: Route components (Home, Shop, ProductDetail, etc.)
- **`/services`**: API mock services and data fetching logic
- **`/types`**: TypeScript interface definitions
- **`index.tsx`**: Application entry point
- **`App.tsx`**: Main routing and app structure

## Styling

This project uses **Tailwind CSS**. Configuration can be found in `tailwind.config.js`. 
Global styles and Tailwind directives are located in `index.css`.

## License

Private / Proprietary.
