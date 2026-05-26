# 📖 Quran App

A keyboard-driven Quran reader built for easy navigation and focus. Navigate without lifting your hands from the keyboard — vim-style, and read on a clean UI without any distractions.

![Double page view](https://github.com/aziz0x00/quran-app/blob/main/screenshot-1.png?raw=true)

![Surah navigation](https://github.com/aziz0x00/quran-app/blob/main/screenshot-2.png?raw=true)


## Features

- **Vim-style navigation** — move through pages with `h j k l` or arrow keys
- **Surah picker** — instant fuzzy-jump to any Surah with `Ctrl+P`
- **Single / double page view** — toggle reading layout on the fly
- **PDF-based rendering** — crisp, faithful rendering via `react-pdf` of [qurancomplex.gov.sa](https://qurancomplex.gov.sa/wp-content/uploads/isdarat/qiraat/warsh39-1.pdf)'s warsh Mushaf.


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

## Contributing

Pull requests are welcome and appreciated. For major changes, please open an issue first to discuss what you'd like to change.
