# Prompter Studio

**A free, open-source teleprompter that records — right in the browser.**

Prompter Studio overlays a smoothly scrolling script on your live camera feed so you can hold eye contact while you speak, then hands you a studio-quality recording the moment you stop. No accounts, no uploads, no installs — everything runs and stays on your device.

This project is open source and community-driven. Anyone is welcome to use it, modify it, and contribute — see [Contributing](#contributing) below.

## Features

- 🎬 **Record while you read** — camera + microphone capture up to 4K, with bitrate tuned automatically to the negotiated resolution
- 📜 **Auto-scrolling script overlay** with live speed (10–160 px/s) and text size (20–96 px) controls
- 🪞 **Mirrored preview** for natural selfie framing and teleprompter glass rigs — recordings are never mirrored
- 🎚️ **Device & quality picker** — choose camera, microphone, and any resolution your hardware supports
- ▶️ **Instant review** — preview your take, download it, or re-record in one tap
- 📦 **Export to MP4, MKV, or MOV** — on-device conversion via ffmpeg.wasm; the converter loads lazily (~31 MB) only when you use it
- 🔒 **Private by design** — footage never leaves your machine; scripts and preferences persist locally

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` and allow camera & microphone access. (Camera APIs require a secure context — use `localhost` or HTTPS.)

### Production build

```bash
npm run build   # outputs to dist/
```

The build is fully static — deploy the `dist/` folder to any static host (Vercel, Netlify, GitHub Pages, etc.) with zero configuration.

## Tech stack

React 19 · TypeScript · Tailwind CSS 4 · Vite — with the MediaRecorder and getUserMedia web APIs. Roboto across the interface.

## Browser support

Latest Chrome, Edge, and Safari. Recordings capture natively as WebM (VP9/VP8 + Opus) or MP4 depending on the browser, and can then be exported to MP4, MKV, or MOV in any browser — conversion runs entirely on your device.

## Contributing

Contributions of every kind are welcome — bug fixes, new features, design improvements, documentation, or just ideas. No contribution is too small.

New here? Read the **[step-by-step contributing guide](docs/CONTRIBUTING.md)** — it covers everything from raising an issue to getting your pull request merged.

1. **Fork** the repository and create a branch for your change
2. **Make your changes** — run `npm run lint` to check the code, and test in a browser with `npm run dev`
3. **Open a pull request** describing what you changed and why

Found a bug or have a feature request? [Open an issue](../../issues) — we'd love to hear from you.

## License

Open source under the [MIT License](LICENSE). Free to use, modify, and distribute.
