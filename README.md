# Infinity Space

An infinite zoom effect built with Astro and Solid.js.

## Tech Stack

- [Astro](https://astro.build) - Static site framework with islands architecture
- [Solid.js](https://www.solidjs.com) - Reactive UI library for the interactive components
- [Tailwind CSS](https://tailwindcss.com) - Utility-first styling
- [Nanostores](https://github.com/nanostores/nanostores) - Lightweight state management

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Project Structure

```
src/
├── actions/
│   └── index.ts
├── assets/
│   └── icons/
├── components/
│   ├── InfinitySpace/          # Core visualization
│   │   ├── index.tsx
│   │   ├── SpaceLayer.tsx
│   │   ├── LayerDots.tsx
│   │   ├── LayerLines.tsx
│   │   ├── LayerIcon.tsx
│   │   ├── TextContent.tsx
│   │   └── IconEchoLayer.tsx
│   ├── interface/
│   │   ├── ControlBar.tsx
│   │   ├── HoustonIcon.tsx
│   │   ├── IconButton.tsx
│   │   ├── control-modules/
│   │   │   ├── DisplayMode.tsx
│   │   │   ├── DownloadButton.tsx
│   │   │   ├── HueSlider.tsx
│   │   │   ├── InfinityToggle.tsx
│   │   │   ├── LayerCountSlider.tsx
│   │   │   ├── MotionButton.tsx
│   │   │   ├── MotionToggle.tsx
│   │   │   └── RandomColor.tsx
│   │   └── mobile/ 
│   │       ├── HuePanel.tsx
│   │       ├── MobileControlBar.tsx
│   │       └── ViewPanel.tsx
│   ├── primitives/
│   │   ├── Icon.tsx
│   │   ├── OptionToggle.tsx
│   │   └── RangeSlider.tsx
│   └── layout/
│       ├── Head.astro
│       └── Page.astro
├── constants/
│   └── config.ts               # Zod validated defaults
├── lib/
│   ├── composables/            # Core animation logic
│   │   ├── createAnimationLoop.ts
│   │   ├── createWaveSystem.ts
│   │   ├── createIconAnimations.ts
│   │   └── useHueColors.ts
│   ├── colorUtils.ts
│   ├── layerHelpers.ts
│   ├── favicon.ts
│   └── store.ts
├── pages/
│   └── index.astro
├── styles/
│   └── global.css
└── types/
```

## License

MIT
