# Changelog

All notable changes to AO3 Rich Comment Editor are documented here.

## [1.0.0] — 2026-06-27

Initial release.

### Features
- Rich/Plain toggle above every AO3 comment box, matching the author editor experience
- Toolbar: bold, italic, underline, strikethrough, headings (h2–h6), blockquote, ordered/unordered lists, links
- Sanitizes output through DOMPurify before writing to the textarea — only AO3-allowed HTML tags pass through
- Works on top-level comment forms and AJAX-loaded reply boxes
- Dark mode support (detects Reversi and system dark mode)

### Vendored libraries
- [Trix 2.1.19](https://github.com/basecamp/trix)
- [DOMPurify 3.1.6](https://github.com/cure53/DOMPurify)
