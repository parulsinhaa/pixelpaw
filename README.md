# PixelPaw

PixelPaw is an Electron desktop pet prototype with a production-ready landing page, browser demo, local profile storage, customization, Pomodoro reminders, tray controls, startup launch support, and a transparent always-on-top pet window.

## Run

```bash
npm install
npm start
```

## Structure

- `src/index.html` - eight-section landing page.
- `src/style.css` - cozy pixel art visual system.
- `src/script.js` - landing interactions, demo pet, XP, mood reactions.
- `src/modules/sprite-engine.js` - sprite-state animation engine at 8-12 FPS.
- `src/modules/pomodoro.js` - focus/break timer.
- `src/modules/notifications.js` - pet-first browser notifications.
- `src/modules/customization.js` - skins and accessories.
- `src/modules/storage.js` - local profile, levels, streak, friendship.
- `src/pet.html` - transparent desktop pet renderer.
- `electron/main.js` - Electron windows, tray, always-on-top pet, launch at startup.
- `electron/preload.js` - safe renderer bridge.
