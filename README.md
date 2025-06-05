# Energy Game

A minimal incremental game built for Codex demonstration.

## Running

From the project directory, launch a simple web server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

Each click on **Gain Energy** adds energy. Every 10 items convert to the next tier. Conversions play a short upgrade sound and briefly highlight the tier.
