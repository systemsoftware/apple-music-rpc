# apple-music-rpc

Show what you're listening to in Apple Music as your Discord Rich Presence — automatically, with live progress tracking.

![macOS](https://img.shields.io/badge/macOS-only-lightgrey?logo=apple)
![Electron](https://img.shields.io/badge/built%20with-Electron-47848F?logo=electron)

---

## Features

- **Now Playing** — displays track name, artist, and album in your Discord status
- **Live countdown** — shows time remaining on the current track via Discord's end timestamp
- **Pause detection** — switches to a "Paused" state with a distinct icon when playback is paused
- **Menu bar app** — lives in your system tray, out of the way; no Dock icon
- **Quit anytime** — right-click the tray icon to exit cleanly

---

## Requirements

- macOS (AppleScript is used to query the Music app)
- [Node.js](https://nodejs.org)
- Apple Music (the built-in macOS Music app)
- A Discord account with Rich Presence enabled

---

## Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/systemsoftware/apple-music-rpc.git
   cd apple-music-rpc
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the app**

   ```bash
   npm start
   ```

The app will appear in your menu bar. Open Apple Music and start playing a track — your Discord status will update within a second.

---

## How It Works

Every second, the app uses AppleScript to query the macOS Music app for the current track's name, artist, album, duration, playback position, and pause state. This information is sent to Discord via the [discord-rpc-revamp](https://www.npmjs.com/package/discord-rpc-revamp) library using your app's Client ID.

When playing, Discord's `endTimestamp` field is calculated from the track's remaining duration so the status shows a live countdown. When paused, the timestamp is omitted and a paused icon is shown instead.

---

## Discord Application Setup

This app uses the Discord Client ID `1248757605267013698`. If you want to use your own Discord application (e.g. to customize the large/small image assets):

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications) and create a new application.
2. Under **Rich Presence → Art Assets**, upload images named `music` (large) and `paused` (small).
3. Copy your **Client ID** and replace the value in `index.js`:

   ```js
   client.connect({ clientId: 'YOUR_CLIENT_ID_HERE' })
   ```

---

## Building a Distributable

To package the app as a standalone `.app`:

```bash
npm install --save-dev electron-builder
npx electron-builder --mac
```

The built app will be in the `dist/` folder.

---

## Credits

Built with [Electron](https://www.electronjs.org), [discord-rpc-revamp](https://www.npmjs.com/package/discord-rpc-revamp), AppleScript, and a tray icon from [Google Material Icons](https://fonts.google.com/icons).

---

## License

MIT