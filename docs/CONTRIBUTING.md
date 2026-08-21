# Contributing to Prompter Studio

Thank you for your interest in contributing! This guide walks you through the whole process step by step — from reporting a bug to getting your code merged. It's written with first-time contributors in mind, so nothing here assumes prior open-source experience.

## Ways to contribute

You don't have to write code to help:

- **Report bugs** you run into
- **Suggest features** or improvements
- **Improve documentation** (including this file!)
- **Fix bugs or build features** via pull requests
- **Test the app** in different browsers and devices and share what you find

---

## Step 1 — Raise an issue

Every contribution starts with an issue. This lets us discuss the change before anyone spends time on code.

### Reporting a bug

1. Go to the repository's **Issues** tab and click **New issue**
2. Give it a clear title, e.g. *"Recording button stays disabled after switching camera"*
3. In the description, include:
   - **What you did** — steps to reproduce, e.g. "Opened the app → switched camera in Settings → clicked Record"
   - **What you expected** — "Recording should start"
   - **What actually happened** — "Button stayed greyed out"
   - **Your environment** — browser and version, operating system
   - A screenshot or screen recording if you can — it helps a lot

### Suggesting a feature

1. Open a **New issue** with a title like *"Feature: countdown timer before recording starts"*
2. Describe:
   - **The problem** — what's frustrating or missing today
   - **Your proposed solution** — how you imagine it working
   - **Alternatives** you considered, if any

### Before opening an issue

Search existing issues first — someone may have already reported it. If so, add a 👍 or a comment with your details instead of opening a duplicate.

---

## Step 2 — Wait for discussion (for larger changes)

- **Small fixes** (typos, obvious bugs): you can skip ahead and open a pull request right away — just mention the issue if one exists.
- **New features or bigger changes**: wait for a maintainer to comment on your issue before writing code. This avoids building something that can't be merged. Once there's agreement on the approach, comment *"I'd like to work on this"* so others know it's taken.

---

## Step 3 — Set up your development environment

You'll need [Node.js](https://nodejs.org) 20 or later and npm.

```bash
# 1. Fork the repository on GitHub (click the "Fork" button)

# 2. Clone YOUR fork to your machine
git clone https://github.com/<your-username>/teleprompter.git
cd teleprompter

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev
```

Open `http://localhost:5173` in your browser and allow camera & microphone access. The app hot-reloads as you edit files.

> **Note:** Camera APIs require a secure context — `localhost` works, but if you test on another device you'll need HTTPS.

### Project layout

```
src/
├── App.tsx                 # Main app component, wires everything together
├── components/             # UI components (VideoPreview, ControlBar, modals, ...)
├── hooks/                  # Logic lives here:
│   ├── useMediaStream.ts   #   camera/mic acquisition & device selection
│   ├── useRecorder.ts      #   MediaRecorder wrapper (start/stop/download)
│   ├── useTeleprompterScroll.ts  # script auto-scroll engine
│   └── useLocalStorage.ts  #   persisted settings & script
└── constants/quality.ts    # resolution presets & bitrate estimation
```

---

## Step 4 — Make your changes

1. **Create a branch** with a descriptive name:

   ```bash
   git checkout -b fix/camera-switch-recording
   ```

2. **Write your code.** Match the style of the surrounding code — TypeScript, React function components with hooks, Tailwind for styling.

3. **Check your work:**

   ```bash
   npm run lint    # lint the code
   npm run build   # make sure it compiles with no type errors
   ```

4. **Test in the browser.** Since this app is built on camera/recording APIs, always verify your change manually with `npm run dev`: record a clip, preview it, download it. If you can, test in both Chrome and Safari — their codec support differs.

5. **Commit** with a clear message:

   ```bash
   git add .
   git commit -m "Fix recording button staying disabled after camera switch"
   ```

---

## Step 5 — Open a pull request

1. **Push your branch** to your fork:

   ```bash
   git push origin fix/camera-switch-recording
   ```

2. On GitHub, open a **pull request** from your branch to the main repository's `main` branch.

3. In the PR description, include:
   - **What** the change does
   - **Why** — link the issue it addresses (e.g. "Fixes #12")
   - **How you tested it** — browsers you tried, what you verified

4. Keep PRs focused: one fix or feature per PR. Small PRs get reviewed and merged much faster.

---

## Step 6 — Code review and merge

- A maintainer will review your PR and may ask questions or request changes — this is a normal part of the process, not criticism.
- To update your PR, just push more commits to the same branch; the PR updates automatically.
- Once approved, a maintainer merges it. Congratulations — you're a contributor! 🎉

---

## Questions?

Not sure about something? Open an issue and ask — questions are welcome. There's no such thing as a dumb question here.
