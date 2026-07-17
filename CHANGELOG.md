# Changelog

English | [한국어](CHANGELOG.ko.md)

All notable changes to this project will be documented in this file. The versioning scheme follows [Semantic Versioning](https://semver.org/).

## Unreleased

## 0.1.2 - 2026-07-17

### Removed

- Removed the legacy `pauseRabbitMarkdownGfm.customCss` configuration key and its fallback logic.

## 0.1.1 - 2026-07-17

### Fixed

- Fixed excessive vertical space below nested lists in markdown preview.

### Changed

- Moved the default theme file to `theme/basic-dark-theme.css`.
- Emptied custom CSS and `markdown.styles` paths in installation defaults to use only the built-in theme.

## 0.1.0 - 2026-07-15

### Added

- GitHub-style alerts and task list rendering.
- Default theme for Markdown preview.
- Support for user CSS override and local file auto-refresh.
- Build and installation scripts for Antigravity and VS Code.
- Open-source contribution documentation and unit tests.

### Changed

- Cleaned up the project name and extension identifiers to `antigravity-markdown-theme` and `devnneth`.
- Separated Markdown transformation and custom CSS management into independent modules.

### Deprecated

- `pauseRabbitMarkdownGfm.customCss` configuration key. Use `antigravityMarkdownTheme.customCss` instead.
