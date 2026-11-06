# Changelog

## [1.1.3] — 2026-11-06

### Added

- AQUA branding: `searxng/aqua` wordmark, AQUA page title and footer.
- Five-colour theme customisation with reset, favicon recolor and accent-driven
  home glow.
- Back-to-top placement preference (Left/Right) alongside the working
  back-to-top control.
- Portable Konsole launcher, desktop installer, systemd template and Arch
  packaging helpers.
- Sanitised `settings.example.yml`; active settings excluded from the repo.

### Changed

- Rebranded all user-facing RAMA strings to AQUA.
- Reworked pagination and Previous/Next chevron alignment.
- Refined category pills, viewer toolbar, infoboxes and result layout.

### Fixed

- Category pills losing their bottom border when selected.
- Back-to-top only changing the URL hash instead of scrolling the page.
- Home glow and favicon not following the custom accent.
- Pagination box-in-a-box and bottom-aligned chevrons.
- Local launcher now stops the server when its Konsole window closes.
