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
├── components/
│   ├── InfinitySpace/          # Core visualization components
│   │   ├── index.tsx           # Main orchestrator
│   │   ├── SpaceLayer.tsx      # Individual layer rendering
│   │   ├── LayerDots.tsx       # Dot grid display mode
│   │   ├── LayerLines.tsx      # Line border display mode
│   │   ├── LayerIcon.tsx       # Floating icon component
│   │   ├── LayerCard.tsx       # Central info card
│   │   └── IconEchoLayer.tsx   # Icon After-images
│   ├── interface/              # Header controls
│   │   └── control-modules/
│   ├── primitives/             # Reusable UI components
│   └── layout/                 # Page layout components
├── lib/
│   ├── composables/            # Solid.js composables
│   │   ├── createAnimationLoop.ts
│   │   ├── createWaveSystem.ts
│   │   ├── createIconAnimations.ts
│   │   └── useHueColors.ts
│   ├── colorUtils.ts           # HSL color utilities
│   ├── layerHelpers.ts         # Layer math and positioning
│   ├── favicon.ts              # Dynamic favicon updates
│   └── store.ts                # Global state (nanostores)
├── constants/
│   └── config.ts               # Configuration with Zod validation
└── pages/
    └── index.astro             
```

## License

MIT
