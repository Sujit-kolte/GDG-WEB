# Theme Switcher Fixes - TODO

## Issues Fixed:
1. [x] FOUC (Flash of Unstyled Content) - Add inline theme script in layout.jsx
2. [x] Hero Title Gradient - Make theme-aware (hardcoded #202124 needs to change in dark mode)
3. [x] Hero Button Shadow - Make theme-aware (hardcoded rgba(66, 133, 244, 0.3))

## Changes Made:
- layout.jsx: Added inline theme initialization script
- Hero.module.css: Made gradient and shadows theme-aware using CSS variables
- globals.css: Added CSS variables for hero section (light and dark mode)

## Status:
- [x] Implement inline theme script in layout.jsx
- [x] Fix Hero.module.css with theme-aware CSS
- [x] Test the implementation

