# Antigravity Markdown Theme

English | [한국어](README.ko.md)

A Markdown theme plugin for Antigravity and Visual Studio Code, inspired by the theme of Antigravity IDE's Plan/Review mode. It supports custom CSS.

## Recent Changes (v0.1.1)

- **Fixed**: Excessive vertical space below nested lists in markdown preview.
- **Changed**: Moved the default theme file to `theme/basic-dark-theme.css`.
- **Changed**: Emptied custom CSS and `markdown.styles` paths in installation defaults to use only the built-in theme.

For full release history, see [CHANGELOG.md](CHANGELOG.md) (or [Korean](CHANGELOG.ko.md)).

## Markdown Rendering Samples

![alt text](https://raw.githubusercontent.com/devnneth/antigravity-markdown-theme/main/assets/sample-1.png)
![alt text](https://raw.githubusercontent.com/devnneth/antigravity-markdown-theme/main/assets/sample-2.png)

## Build Requirements

- Node.js 20 or higher
- npm
- Antigravity IDE or VS Code 1.70 or higher

## Setup for Development

```sh
git clone https://github.com/devnneth/antigravity-markdown-theme.git
cd antigravity-markdown-theme
npm ci
```

## Build and Install

```sh
./scripts/build.sh
./scripts/install-antigravity.sh
./scripts/install-vscode.sh
```

`build.sh` runs static checks and tests, and generates `antigravity-markdown-theme-<version>.vsix` matching the `package.json` version. The installation scripts install the VSIX into the corresponding IDE after building.

If the CLI cannot be found automatically, you can specify the executable via environment variables:

```sh
ANTIGRAVITY_CLI=/path/to/antigravity-ide ./scripts/install-antigravity.sh
VSCODE_CLI=/path/to/code ./scripts/install-vscode.sh
```

Run `Developer: Reload Window` in your IDE after installation.

## Custom CSS

Always applied as the default theme. If you add CSS paths in your user or workspace settings, those CSS files will be loaded afterward to override the built-in styles.

```json
{
  "antigravityMarkdownTheme.customCss": [
    "/<PATH>/style.css"
  ]
}
```

## Font Size

The base body text size follows the IDE's `markdown.preview.fontSize` setting. Headings, tables, code, etc. scale proportionally using relative units.

```json
{
  "markdown.preview.fontSize": 16
}
```

## Development Commands

```sh
npm run check
npm test
npm run package:vsix
```

## Code Structure

```text
extension.js                  Extension entry point and Markdown-it registration
src/markdown-transform.js     Alert and task list token transformation
src/custom-css-manager.js     Custom CSS setting sync and file watching
theme/basic-dark-theme.css    Default preview theme distributed
test/                         Unit tests based on Node's built-in test runner
scripts/                      Build and IDE-specific install scripts
```

Refer to [CONTRIBUTING.md](CONTRIBUTING.md) for how to make changes and verification criteria, and [CHANGELOG.md](CHANGELOG.md) for release history.

## License

[MIT](LICENSE) © [devnneth](https://github.com/devnneth) and contributors
