# Quick Reference: Vanilla JS → React Conversion

## 🎯 Common Patterns at a Glance

### DOM Manipulation

```javascript
// ❌ VANILLA JS
const btn = document.getElementById("button");
btn.addEventListener("click", () => {
  btn.classList.add("active");
  btn.textContent = "Clicked!";
});

// ✅ REACT
const [isActive, setIsActive] = useState(false);

return (
  <button
    className={isActive ? "active" : ""}
    onClick={() => {
      setIsActive(true);
    }}>
    {isActive ? "Clicked!" : "Click me"}
  </button>
);
```

### Page Load Execution

```javascript
// ❌ VANILLA JS
window.addEventListener("load", () => {
  console.log("Page loaded");
  setupTheme();
  loadEvents();
});

// ✅ REACT
useEffect(() => {
  console.log("Component mounted");
  setupTheme();
  loadEvents();
}, []); // Empty dependency array = runs once on mount
```

### Interval/Timeout

```javascript
// ❌ VANILLA JS
let count = 0;
setInterval(() => {
  count++;
  console.log(count);
}, 1000);

// ✅ REACT
const [count, setCount] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setCount((prev) => prev + 1);
  }, 1000);

  return () => clearInterval(interval); // CLEANUP!
}, []);
```

### API Fetching

```javascript
// ❌ VANILLA JS
async function loadData() {
  try {
    const response = await fetch("http://api.com/data");
    const data = await response.json();

    const container = document.getElementById("container");
    container.innerHTML = data
      .map((item) => `<div>${item.name}</div>`)
      .join("");
  } catch (error) {
    console.error(error);
  }
}

window.addEventListener("load", loadData);

// ✅ REACT
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const loadData = async () => {
    try {
      const response = await fetch("http://api.com/data");
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, []);

return (
  <>
    {loading && <p>Loading...</p>}
    {error && <p>Error: {error}</p>}
    {data.map((item) => (
      <div key={item.id}>{item.name}</div>
    ))}
  </>
);
```

### Event Listeners

```javascript
// ❌ VANILLA JS
document.getElementById("input").addEventListener("change", (e) => {
  console.log(e.target.value);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    // do something
  }
});

// ✅ REACT
const [value, setValue] = useState("");

return (
  <input
    onChange={(e) => setValue(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        // do something
      }
    }}
  />
);
```

### IntersectionObserver

```javascript
// ❌ VANILLA JS
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
});

document.querySelectorAll(".item").forEach((el) => {
  observer.observe(el);
});

// ✅ REACT
useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  });

  const items = document.querySelectorAll(".item");
  items.forEach((el) => observer.observe(el));

  return () => observer.disconnect(); // CLEANUP!
}, []);
```

### localStorage

```javascript
// ❌ VANILLA JS
const theme = localStorage.getItem("theme") || "light";
localStorage.setItem("theme", "dark");

// ✅ REACT (with hydration safety)
const [theme, setTheme] = useState(null);
const [isHydrated, setIsHydrated] = useState(false);

useEffect(() => {
  const savedTheme = localStorage.getItem("theme") || "light";
  setTheme(savedTheme);
  setIsHydrated(true);
}, []);

if (!isHydrated) return null; // Prevent hydration mismatch

return (
  <button
    onClick={() => {
      const newTheme = theme === "dark" ? "light" : "dark";
      setTheme(newTheme);
      localStorage.setItem("theme", newTheme);
    }}>
    Toggle Theme
  </button>
);
```

### Conditional CSS Classes

```javascript
// ❌ VANILLA JS
if (isActive) {
  element.classList.add("active");
} else {
  element.classList.remove("active");
}

if (hasError) {
  element.classList.toggle("error");
}

// ✅ REACT
return (
  <>
    {/* Simple conditional */}
    <div className={isActive ? "active" : ""}>Active</div>

    {/* Multiple classes */}
    <div
      className={`base ${isActive ? "active" : ""} ${hasError ? "error" : ""}`}>
      Content
    </div>

    {/* Using CSS Modules */}
    <div className={`${styles.base} ${isActive ? styles.active : ""}`}>
      Content
    </div>
  </>
);
```

### Array/List Manipulation

```javascript
// ❌ VANILLA JS
const items = [];
document.querySelectorAll(".item").forEach((el, i) => {
  items.push({
    id: i,
    text: el.textContent,
  });
});

const container = document.getElementById("list");
container.innerHTML = items.map((item) => `<li>${item.text}</li>`).join("");

// ✅ REACT
const items = [
  { id: 1, text: "Item 1" },
  { id: 2, text: "Item 2" },
];

return (
  <ul>
    {items.map((item) => (
      <li key={item.id}>{item.text}</li>
    ))}
  </ul>
);
```

---

## 🎯 React Hooks Cheat Sheet

### useState

```jsx
const [state, setState] = useState(initialValue);
// Used for: form inputs, toggles, counts, etc.
```

### useEffect

```jsx
useEffect(() => {
  // Code to run
  return () => {
    // Cleanup (optional)
  };
}, [dependencies]); // Run when dependencies change

// Common patterns:
useEffect(() => {
  /* ... */
}, []); // Run once on mount
useEffect(() => {
  /* ... */
}, [state]); // Run when state changes
useEffect(() => {
  /* ... */
}); // Run after every render (avoid!)
```

### useRef

```jsx
const ref = useRef(null);
// Used for: direct DOM access, timers, focus

useEffect(() => {
  ref.current?.focus();
}, []);

return <input ref={ref} />;
```

### useContext (for global state)

```jsx
const value = useContext(MyContext);
// Used for: theme, user, settings, etc.
```

### Custom Hooks

```jsx
function useCustom() {
  const [state, setState] = useState("");
  // ... logic
  return [state, setState];
}

const [value, setValue] = useCustom();
```

---

## 📁 File Organization Guide

### Component File Structure

```jsx
// app/components/MyComponent.jsx
"use client"; // Add if using hooks

import { useState, useEffect } from "react";
import styles from "./MyComponent.module.css";

/**
 * MyComponent Description
 * @component
 * @param {Object} props - Component props
 * @returns {JSX.Element}
 */
export default function MyComponent() {
  // State
  const [state, setState] = useState("");

  // Effects
  useEffect(() => {
    // Setup
    return () => {
      // Cleanup
    };
  }, []);

  // Handlers
  const handleClick = () => {
    setState("new value");
  };

  // Render
  return <section className={styles.component}>{/* JSX */}</section>;
}
```

### CSS Module Structure

```css
/* app/components/MyComponent.module.css */
.component {
  padding: 2rem;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.component h1 {
  font-size: 2rem;
}

@media (max-width: 768px) {
  .component {
    padding: 1rem;
  }
}
```

---

## 🚨 Common Mistakes

### ❌ Missing Dependency in useEffect

```javascript
// WRONG - will cause infinite loops
useEffect(() => {
  fetchData();
}); // No dependency array!

// RIGHT
useEffect(() => {
  fetchData();
}, [dependency]); // Specify dependencies
```

### ❌ Missing Cleanup

```javascript
// WRONG - memory leak
useEffect(() => {
  const interval = setInterval(() => {}, 1000);
}); // No cleanup!

// RIGHT
useEffect(() => {
  const interval = setInterval(() => {}, 1000);
  return () => clearInterval(interval); // Cleanup
}, []);
```

### ❌ Direct DOM Manipulation

```javascript
// WRONG in React
document.getElementById("count").textContent = count;

// RIGHT
<div>{count}</div>;
```

### ❌ Forgetting Key in Lists

```javascript
// WRONG
{
  items.map((item) => <div>{item.name}</div>);
} // No key!

// RIGHT
{
  items.map((item) => <div key={item.id}>{item.name}</div>);
}
```

### ❌ Modifying State Directly

```javascript
// WRONG
state.name = "new name";

// RIGHT
setState({ ...state, name: "new name" });
// OR
setState((prev) => ({ ...prev, name: "new name" }));
```

---

## 🔍 Debugging Tips

### Console Logging

```jsx
useEffect(() => {
  console.log("Component mounted");
  return () => console.log("Component unmounted");
}, []);

return <div onClick={() => console.log("clicked")}>Debug</div>;
```

### React DevTools

- Install React DevTools browser extension
- Inspect component tree
- See state and props
- Track re-renders

### Next.js DevTools

- Built-in to `npm run dev`
- Check terminal for errors
- View compiled code

---

## 📊 Performance Checklist

- [ ] Use `useCallback` for event handlers (if passing to child components)
- [ ] Use `useMemo` for expensive computations
- [ ] Implement cleanup functions in `useEffect`
- [ ] Avoid inline object/array creation in renders
- [ ] Use `key` prop correctly in lists
- [ ] Lazy load images with Next.js `Image` component
- [ ] Prevent unnecessary re-renders with `React.memo`
- [ ] Use `requestAnimationFrame` for animations

---

## 🎓 Quick Learning Links

- **React Docs**: https://react.dev
- **Next.js Docs**: https://nextjs.org/docs
- **CSS Modules**: https://create-react-app.dev/docs/adding-a-css-modules-stylesheet/
- **React Hooks**: https://react.dev/reference/react

---

**Save this as a bookmark! Reference it while converting your code.** 🔖
