# MyClock

A public-facing clock app with the core tools people expect from online clock sites: clock, alarms, timer, stopwatch, world clocks, mood/audience themes, and ad-ready placements.

## Features

- Live digital and analog clock display
- Multiple saved alarms with labels, repeat, snooze, browser notifications, and alert tones
- Countdown timer with presets, custom durations, progress ring, and completion alerts
- Stopwatch with lap and split tracking
- World clocks for cities across every continent, with typeahead city search
- Fullscreen mode for clock, alarm, timer, stopwatch, world clock, theme, and insight widgets
- Settings side menu for font, theme, time format, seconds, tone, and notifications
- Mood and age-group themes: Classic, Midnight, Sunrise, Playful, Neon, and High Contrast
- AdSense-ready placements for top banner, in-page, and sidebar inventory
- Local persistence with `localStorage`

## Stack

- Vite
- React
- TypeScript
- Lucide React

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The app builds to static files in `dist/`, so it can be deployed to hosts such as Netlify, Vercel, Cloudflare Pages, GitHub Pages, or any static web server.

## AdSense Setup

Copy `.env.example` to `.env.local` and replace the values with your AdSense publisher ID and ad unit slot IDs:

```bash
VITE_ADSENSE_CLIENT_ID=ca-pub-your-publisher-id
VITE_ADSENSE_SLOT_TOP=your-top-slot
VITE_ADSENSE_SLOT_INLINE=your-inline-slot
VITE_ADSENSE_SLOT_RAIL=your-rail-slot
```

Without those values, the app shows non-serving ad placeholders so development and static builds still work.
