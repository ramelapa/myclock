# AdSense Setup

The app is prepared for Google AdSense, but it will not serve live ads until a real AdSense account, approved site, publisher ID, and ad unit slots are configured.

## Required Values

Add these values to `.env.local`:

```bash
VITE_ADSENSE_CLIENT_ID=ca-pub-your-publisher-id
VITE_ADSENSE_SLOT_TOP=your-top-slot
VITE_ADSENSE_SLOT_INLINE=your-inline-slot
VITE_ADSENSE_SLOT_RAIL=your-rail-slot
```

## Current Placements

- `top`: banner placement after the hero clock
- `inline`: in-page placement after the active tool section
- `rail`: sidebar placement on the Clock tab

## Notes

- Auto ads can be enabled in AdSense separately after the site is approved.
- Manual ad units are controlled by the slot IDs above.
- Local development shows placeholders when env vars are not set.
- Do not place ads where they cover controls or where controls cover ads.
