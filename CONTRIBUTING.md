# Contributing

English | [한국어](CONTRIBUTING.ko.md)

Thank you for contributing to the Antigravity Markdown Theme!

## Getting Started

1. Fork and clone the repository.
2. Run `npm ci` on Node.js 20 or higher.
3. Verify that `npm test` passes before making any changes.
4. Make small, focused changes per feature and add corresponding tests.

## Development Principles

- Do not modify the original Markdown files.
- Do not unnecessarily change the rendering of standard blockquotes and standard lists.
- Place Markdown syntax transformations in `src/markdown-transform.js`.
- Place IDE configuration and file watching in `src/custom-css-manager.js`.
- If you only want to change the preview appearance, modify only `theme/basic-dark-theme.css`.
- Unless a new build step is strictly required, maintain CommonJS and the built-in Node test runner.

## Verification

```sh
npm run check
npm test
./scripts/build.sh
```

Verify CSS changes directly in the built-in Markdown preview of Antigravity and VS Code. Check at least the following items:

- Ensure all elements scale proportionally when changing `markdown.preview.fontSize` to 12, 14, or 20.
- Verify that table borders and rounding do not break.
- Ensure alerts do not move unexpectedly or get clipped before and after hover.
- Check that checked and unchecked task lists are clearly distinguished.
- Confirm that standard blockquotes are not mistaken for alerts.

## Pull Requests

- Explain the reason for the change and the user-facing differences.
- Include tests for behavioral changes.
- Attach before-and-after screenshots for visual changes if possible.
- Update the `Unreleased` section in [CHANGELOG.md](CHANGELOG.md).
- Do not commit the generated `.vsix` file.

## Release

1. Update the version in `package.json`.
2. Move the `Unreleased` items in [CHANGELOG.md](CHANGELOG.md) to the new version section.
3. Run `npm ci`, `npm run check`, and `npm test`.
4. Generate the VSIX package using `./scripts/build.sh`.
5. Install the package in both Antigravity and VS Code to perform a smoke test.
