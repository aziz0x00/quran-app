# 📖 Quran App

A keyboard-driven Quran reader built for speed and focus. Navigate through all 114 Surahs without lifting your hands from the keyboard — vim-style.

![](https://private-user-images.githubusercontent.com/42474471/598121094-7f293721-5f15-4c6a-a9c8-7554c5ee4904.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3Nzk3OTA5MzMsIm5iZiI6MTc3OTc5MDYzMywicGF0aCI6Ii80MjQ3NDQ3MS81OTgxMjEwOTQtN2YyOTM3MjEtNWYxNS00YzZhLWE5YzgtNzU1NGM1ZWU0OTA0LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNjA1MjYlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYwNTI2VDEwMTcxM1omWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWIzMjVlYzUxYzY0MjJjZmJmODI1NzBmZTM2MGJjZWQ4NWRlZmI0ODZjOWRlZWQwYjRiMTRlMjJhOWNlODdkMmEmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnJlc3BvbnNlLWNvbnRlbnQtdHlwZT1pbWFnZSUyRnBuZyJ9.REEffHmwbLwtLlXziV_wRx_OGtc-fIWYlTSJzeiE9x8)

![](https://private-user-images.githubusercontent.com/42474471/598120301-385997dc-3584-49b9-8edd-bcc4290c6f60.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3Nzk3OTEzMjMsIm5iZiI6MTc3OTc5MTAyMywicGF0aCI6Ii80MjQ3NDQ3MS81OTgxMjAzMDEtMzg1OTk3ZGMtMzU4NC00OWI5LThlZGQtYmNjNDI5MGM2ZjYwLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNjA1MjYlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYwNTI2VDEwMjM0M1omWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWVjYzg5MDI2YmY3YzliMTU3ZGQ3ZDc4NDU0ZmZhOTUyODY1YjliYThkMmIyMDk4MWVjNWRlMTFkMmFhY2MxMjMmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnJlc3BvbnNlLWNvbnRlbnQtdHlwZT1pbWFnZSUyRnBuZyJ9.Y1vn93R6Kp0BzttERgBha3m2dc-xCwmJkQyGsRZDJy0)


## Features

- **Vim-style navigation** — move through pages with `h j k l` or arrow keys
- **Surah picker** — instant fuzzy-jump to any Surah with `Ctrl+P`
- **Single / double page view** — toggle reading layout on the fly
- **PDF-based rendering** — crisp, faithful rendering via `react-pdf`


## Getting Started

**Prerequisites:** Node.js ≥ 18 and [pnpm](https://pnpm.io/installation)

```bash
# Clone the repo
git clone https://github.com/aziz0x00/quran-app.git
cd quran-app

# Install dependencies
pnpm install

# Start the dev server
pnpm dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Keybindings

| Key | Action |
|---|---|
| `Ctrl+P` | Open Surah menu |
| `h` / `←` | Previous page |
| `l` / `→` | Next page |
| `j` / `↓` | Scroll down |
| `k` / `↑` | Scroll up |
| `Tab` | Toggle single / double page view |

> More vim-style bindings are planned.

## Scripts

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm preview    # Preview production build
```

## Contributing

Pull requests are welcome and appreciated. For major changes, please open an issue first to discuss what you'd like to change.
