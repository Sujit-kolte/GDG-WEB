# GDG SKNCOE - Next.js Conversion

A modern Next.js 14 (App Router) conversion of the GDG SKNCOE vanilla HTML/CSS/JS website with **100% feature parity**.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone or navigate to the project
cd nextjs-conversion

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## 📋 Project Structure

```
app/
├── components/          # Reusable React components
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── AboutSection.jsx
│   ├── VisionMission.jsx
│   ├── EventsSection.jsx
│   ├── TechSlider.jsx
│   ├── SponsorsSection.jsx
│   ├── FAQSection.jsx
│   ├── Footer.jsx
│   ├── ThemeSwitcher.jsx
│   ├── PageLoader.jsx
│   └── *.module.css      # Scoped styles
├── layout.jsx           # Root layout with metadata
├── page.jsx            # Home page (assembles components)
├── globals.css         # Global styles & theme tokens
├── hooks/              # Custom React hooks (future)
└── utils/              # Utility functions (future)

public/                 # Static assets
├── logo.png
├── hero.png
├── grp.jpg
└── ...

package.json            # Dependencies & scripts
next.config.js          # Next.js configuration
jsconfig.json           # Path aliases
.env.local              # Environment variables
MIGRATION_GUIDE.md      # Detailed migration documentation
```

## 🎯 Key Features

### ✨ Preserved from Vanilla Version

- ✅ **Page Loader** - GDG logo animation (4.8s)
- ✅ **Navbar** - Navigation with theme toggle
- ✅ **Hero Section** - Image carousel (5s interval)
- ✅ **About Section** - Team information with scroll animation
- ✅ **Vision/Mission/Values** - Reveal animations
- ✅ **Events Section** - Horizontal scrolling event cards from API
- ✅ **Tech Slider** - Auto-scrolling technology cards
- ✅ **Sponsors** - Partner logos
- ✅ **FAQ** - Accordion with expand/collapse
- ✅ **Google Map** - Location embed
- ✅ **Theme System** - Light/Dark mode with localStorage
- ✅ **Responsive Design** - Works on all devices

### 🆕 Improvements

- Component-based architecture (reusable, maintainable)
- React hooks instead of vanilla JS
- CSS Modules (no style conflicts)
- Better SEO with Next.js metadata
- Cleaner code organization
- Easier to extend & test

## 🔧 Configuration

### Environment Variables (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5501
NEXT_PUBLIC_THEME_STORAGE_KEY=gdg-theme-preference
```

### Customize

- **Images**: Place in `/public` folder, update paths in components
- **Colors**: Edit theme variables in `app/globals.css`
- **Content**: Modify component JSX files
- **API**: Update `NEXT_PUBLIC_API_URL` for different endpoints

## 📱 Pages & Routes

- `/` - Home (all sections)
- Each section has an ID anchor: `#home`, `#about`, `#vision-mission`, `#events`, `#sponsors`, `#faq`, `#location`

## 🎨 Styling

### Global Styles (`app/globals.css`)

- CSS variables for theming
- Light/Dark mode support
- Grid background pattern
- Animation keyframes

### Component Styles (`components/*.module.css`)

- Scoped CSS (no naming conflicts)
- Uses global CSS variables
- Responsive breakpoints

### Theme System

```css
:root {
  /* Light mode (default) */
  --bg-primary: #ffffff;
  --text-primary: #202124;
}

[data-theme="dark"] {
  /* Dark mode */
  --bg-primary: #121212;
  --text-primary: #e8eaed;
}
```

## 📊 Component Breakdown

| Component       | Type   | Features                          |
| --------------- | ------ | --------------------------------- |
| Navbar          | Client | Navigation, theme toggle, socials |
| Hero            | Client | Image carousel, CTA button        |
| AboutSection    | Client | Scroll animation, team info       |
| VisionMission   | Client | Reveal animation, 3 cards         |
| EventsSection   | Client | API fetching, horizontal scroll   |
| TechSlider      | Client | Auto-scroll, hover effects        |
| SponsorsSection | Static | Partner logos                     |
| FAQSection      | Client | Accordion, map embed              |
| Footer          | Static | Links, copyright, socials         |
| ThemeSwitcher   | Client | Theme toggle, localStorage        |
| PageLoader      | Client | Splash screen animation           |

## 🔌 API Integration

### Events API

```javascript
// Fetches from: {NEXT_PUBLIC_API_URL}/api/events
// Expected format:
{
  _id: "123",
  title: "Event Title",
  category: "Workshop",
  day: "15",
  month: "Jan",
  year: "2024",
  time: "10:00 AM",
  location: "SKNCOE",
  regLink: "https://...",
  images: ["url1", "url2"]
}
```

## 📚 Learning Resources

- See **MIGRATION_GUIDE.md** for detailed vanilla-to-React conversion patterns
- Each component file has JSDoc comments
- React Hooks: https://react.dev/reference/react
- Next.js: https://nextjs.org/docs

## 🚀 Build & Deploy

### Production Build

```bash
npm run build
npm run start
```

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Other Platforms

- **Netlify**: Supports Next.js
- **GitHub Pages**: Needs static export (advanced)
- **Docker**: Create Dockerfile with Node.js

## 🐛 Troubleshooting

### Images not loading?

- Ensure images are in `/public` folder
- Use correct relative paths (without `/public`)

### API errors?

- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure backend server is running on correct port
- Check CORS settings on backend

### Theme not persisting?

- Check browser's localStorage is enabled
- Clear browser cache/storage if needed
- Check theme-switcher.js console for errors

### Hydration warnings?

- These occur during Next.js hydration (normal)
- They don't affect functionality
- Add hydration checks in components using `useEffect`

## 📝 Next Steps

1. **Copy Assets**: Place images in `/public` folder
2. **Update Links**: Change social media URLs in components
3. **Test Locally**: Run `npm run dev` and verify all sections
4. **Update API URL**: Change `.env.local` for production
5. **Deploy**: Push to GitHub, Vercel, or your hosting

## 👨‍💻 Component Development

### Creating a New Component

```jsx
// app/components/NewComponent.jsx
"use client"; // Only if using hooks

import styles from "./NewComponent.module.css";

export default function NewComponent() {
  return (
    <section className={styles.newComponent}>{/* Component content */}</section>
  );
}
```

```css
/* app/components/NewComponent.module.css */
.newComponent {
  padding: 4rem 2rem;
  background: var(--bg-card);
}
```

Then import in `app/page.jsx`:

```jsx
import NewComponent from "./components/NewComponent";

export default function Home() {
  return (
    <>
      <NewComponent />
    </>
  );
}
```

## 📊 Performance Tips

- Use Next.js `Image` component for images
- Lazy load offscreen components with dynamic imports
- Optimize API calls with SWR or React Query
- Use `requestAnimationFrame` for smooth animations

## 🔐 Best Practices

- ✅ Keep components small and focused
- ✅ Use CSS Modules for styles
- ✅ Add proper cleanup in `useEffect`
- ✅ Use semantic HTML
- ✅ Add ARIA labels for accessibility
- ✅ Handle error states in data fetching
- ✅ Validate API responses

## 📄 License

Same as original GDG SKNCOE project

## 🤝 Support

For issues or questions:

1. Check MIGRATION_GUIDE.md
2. Review component comments
3. Check Next.js documentation
4. Open an issue on GitHub

---

**Happy coding! 🚀**
