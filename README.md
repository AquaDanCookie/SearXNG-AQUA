# SearXNG AQUA

A privacy-first SearXNG metasearch instance with the AQUA theme, a polished
RAMA-derived interface, and practical desktop integration.

![SearXNG AQUA home page](docs/images/home.jpg)

SearXNG AQUA is a local fork/customisation of
[SearXNG](https://github.com/searxng/searxng) and the
[SearXNG RAMA](https://github.com/Nomadcxx/searxng-RAMA) theme. It is not
affiliated with or endorsed by either upstream project.

## Features

- **AQUA branding** — `searxng/aqua` wordmark, AQUA title and footer.
- **Customisable theme colours** — accent, background, cards, text and muted
  colours, saved in the browser and applied instantly.
- **Polished search UI** — fixed image viewer, infobox spacing, category pills,
  pagination boxes and optically centred Previous/Next chevrons.
- **Back-to-top control** — actually scrolls the page, with a Left/Right
  placement preference in **Preferences → User Interface**.
- **Accent-driven details** — home-page glow and favicon follow the chosen
  accent colour.
- **Desktop-friendly launcher** — runs the server in Konsole with live logs;
  closing the window stops the server.
- **Arch packaging helpers** — optional desktop, systemd and pacman-hook
  templates for the `searxng-rama` AUR base.

## Quick start (from source)

Requirements: Python 3.11 or newer, a C toolchain and the usual SearXNG system
libraries (`libxml2`, `libxslt`, `libffi`, `openssl`, `zlib`, …). On Arch Linux,
the packages required by the `searxng-rama` AUR package cover these.

```bash
git clone https://github.com/AquaDanCookie/SearXNG-AQUA.git
cd SearXNG-AQUA

python3 -m venv app/venv
app/venv/bin/pip install -r app/requirements.txt

cp app/searx/settings.example.yml app/searx/settings.yml
# Edit app/searx/settings.yml and set server.secret_key to a unique value.

./bin/searxng-aqua-console
```

The launcher opens <http://localhost:8855/> once the server is ready, and keeps
the server attached to its Konsole window. Closing the window stops it.

The example settings bind to `127.0.0.1` and use port `8855`. Change
`server.bind_address` only if you intentionally want LAN access.

### Desktop shortcut

```bash
./packaging/install-desktop.sh
```

This installs a per-user KDE/XDG desktop entry, an AQUA icon, and a
`~/.local/bin/searxng-aqua-console` symlink. The app then appears as
**SearXNG AQUA** in the application menu.

## Configuration

The active configuration is `app/searx/settings.yml` (ignored by git). Start
from `app/searx/settings.example.yml` and set at least:

```yaml
general:
  instance_name: "SearXNG AQUA Edition"
server:
  port: 8855
  bind_address: "127.0.0.1"
  limiter: false
  secret_key: "CHANGE_ME"
```

The active `settings.yml` is deliberately excluded from the repository so
personal keys and engine choices are not published.

### Theme colours and layout

Open **Preferences → User Interface**:

- **Theme colours** — five colour pickers plus **Reset to theme**. Saved in
  browser storage for the `http://localhost:8855/` origin.
- **Back to top button** — choose **Left side** or **Right side**.

### systemd (optional)

`packaging/searxng-aqua.service.in` is a template for a system service. Replace
`@USER@` and `@APP_DIR@`, install the unit, and enable it only if you do not
want to use the Konsole launcher.

### Arch / AUR base (optional)

The repository is a full source tree and does not require the AUR package. The
`packaging/` directory also contains a pacman hook and UI-fix applier for an
existing `searxng-rama` AUR installation at `/opt/searxng-rama`; those files
retain the upstream package name so they keep working with the package.

## Project layout

```text
app/                 SearXNG source tree (prebuilt theme; no Node build needed)
bin/                 Portable Konsole launcher
fixes/               Re-applied UI-fix CSS/JS source
packaging/           Desktop, systemd and pacman-hook helpers
docs/images/         README screenshot
```

The UI-fix CSS/JS is applied in the shipped theme bundles under
`app/searx/static/themes/simple/`, so no build step is required. The same
source is in `fixes/` for future edits; `tools/apply-fixes` can re-apply it to
`app/` without root.

## Updating

```bash
git pull
app/venv/bin/pip install -r app/requirements.txt
```

Your `app/searx/settings.yml` is ignored by git and is preserved. Re-apply the
UI fixes if the theme bundles change:

```bash
./tools/apply-fixes
```

## Version

- **AQUA 1.1.3**
- Based on SearXNG RAMA 1.1.3 / SearXNG `2026.11.5+3e95f6cd2`

The user-facing brand is AQUA. Technical identifiers in the packaging and
upstream source (the `searxng-rama` package name, `/opt` path, theme variant
file names and `RAMA-UI-FIX` marker names) are retained for compatibility.

## Credits

- [SearXNG](https://github.com/searxng/searxng) — the metasearch engine
  (AGPL-3.0).
- [SearXNG RAMA](https://github.com/Nomadcxx/searxng-RAMA) — the RAMA theme and
  package base (AGPL-3.0).
- AQUA branding, UI fixes and local integration — this fork.

## License

Distributed under the **GNU Affero General Public License v3.0**; see
[LICENSE](LICENSE). SearXNG and SearXNG RAMA are also AGPL-3.0 projects.
