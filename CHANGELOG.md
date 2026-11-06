# Changelog

## [1.1.3] (2026-11-06)

### Added

- AQUA wordmark, page title and footer.
- Five colour controls for accent, background, cards, text and muted text.
  The favicon and home glow follow the chosen accent.
- Back-to-top placement preference (Left or Right) alongside the working
  back-to-top control.
- Portable Konsole launcher, desktop installer and systemd template.
- Sanitised `settings.example.yml`; the active settings file is excluded from
  the repository.

### Changed

- Replaced user-facing RAMA strings with AQUA.
- Adjusted pagination boxes and Previous/Next alignment.
- Adjusted category pill borders, viewer toolbar, infobox spacing and result
  layout.

### Fixed

- Category pill bottom borders on selected chips.
- Back-to-top changed only the URL hash instead of scrolling the page.
- Home glow and favicon ignored the custom accent.
- Pagination rendered a box inside a box, and chevrons sat below centre.
- The launcher left the server running when its Konsole window closed.
