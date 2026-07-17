const assert = require("node:assert/strict");
const test = require("node:test");
const {
  createCustomCssManager,
  hasExplicitConfigurationValue,
  isRemoteCssPath,
  mergeManagedStyles,
  normalizeCssPaths,
  readConfiguredStyles,
  resolveLocalCssPath,
} = require("../src/custom-css-manager");

test("normalizes duplicate and empty custom CSS paths", () => {
  assert.deepEqual(normalizeCssPaths([" theme.css ", "", "theme.css", null]), ["theme.css"]);
  assert.deepEqual(normalizeCssPaths(" theme.css "), ["theme.css"]);
});

test("places managed custom CSS after unmanaged Markdown styles", () => {
  assert.deepEqual(
    mergeManagedStyles(
      ["existing.css", "old-custom.css"],
      ["old-custom.css"],
      ["new-custom.css", "existing.css"],
    ),
    ["existing.css", "new-custom.css"],
  );
});

test("distinguishes remote URLs from local CSS paths", () => {
  assert.equal(isRemoteCssPath("https://example.com/theme.css"), true);
  assert.equal(isRemoteCssPath("file:///tmp/theme.css"), false);
  assert.equal(isRemoteCssPath("styles/theme.css"), false);
});

test("resolves workspace-relative and file URL CSS paths", () => {
  const vscode = {
    Uri: {
      joinPath: (uri, cssPath) => ({ fsPath: `${uri.fsPath}/${cssPath}` }),
      parse: () => ({ fsPath: "/tmp/theme.css" }),
    },
  };
  const folder = { uri: { fsPath: "/workspace" } };

  assert.equal(resolveLocalCssPath(vscode, folder, "styles/theme.css"), "/workspace/styles/theme.css");
  assert.equal(resolveLocalCssPath(vscode, folder, "file:///tmp/theme.css"), "/tmp/theme.css");
});

test("prefers the current custom CSS setting and supports the legacy key", () => {
  const values = {
    antigravityMarkdownTheme: ["current.css"],
    pauseRabbitMarkdownGfm: ["legacy.css"],
  };
  const vscode = {
    workspace: {
      getConfiguration: (section) => ({ get: () => values[section] }),
    },
  };

  assert.deepEqual(readConfiguredStyles(vscode, {}), ["current.css"]);
  values.antigravityMarkdownTheme = [];
  assert.deepEqual(readConfiguredStyles(vscode, {}), ["legacy.css"]);
});

test("an explicitly empty current setting disables legacy fallback", () => {
  const vscode = {
    workspace: {
      getConfiguration: (section) => ({
        get: () => (section === "pauseRabbitMarkdownGfm" ? ["legacy.css"] : []),
        inspect: () => (section === "antigravityMarkdownTheme" ? { workspaceValue: [] } : {}),
      }),
    },
  };

  assert.equal(hasExplicitConfigurationValue({ inspect: () => ({ workspaceValue: [] }) }, "x"), true);
  assert.deepEqual(readConfiguredStyles(vscode, {}), []);
});

test("syncs custom CSS into Markdown styles and creates a local watcher", async () => {
  const updatedStyles = [];
  const watchers = [];
  const subscriptions = [];
  const folder = { uri: { fsPath: "/workspace", toString: () => "file:///workspace" } };
  const disposable = () => ({ dispose() {} });
  const vscode = {
    ConfigurationTarget: { WorkspaceFolder: 3 },
    RelativePattern: class RelativePattern {
      constructor(base, pattern) {
        this.base = base;
        this.pattern = pattern;
      }
    },
    Uri: {
      joinPath: (uri, cssPath) => ({ fsPath: `${uri.fsPath}/${cssPath}` }),
      parse: (value) => ({ fsPath: value.replace("file://", "") }),
    },
    commands: { executeCommand() {} },
    window: { showWarningMessage() {} },
    workspace: {
      workspaceFolders: [folder],
      createFileSystemWatcher: (pattern) => {
        const watcher = {
          pattern,
          dispose() {},
          onDidChange() {},
          onDidCreate() {},
          onDidDelete() {},
        };
        watchers.push(watcher);
        return watcher;
      },
      getConfiguration: (section) => {
        if (section === "antigravityMarkdownTheme") {
          return { get: () => ["styles/theme.css"], inspect: () => ({ workspaceValue: [] }) };
        }
        if (section === "markdown") {
          return {
            get: () => ["existing.css"],
            update: async (_setting, value, target) => updatedStyles.push({ value, target }),
          };
        }
        return { get: () => [] };
      },
      onDidChangeConfiguration: (callback) => {
        subscriptions.push(callback);
        return disposable();
      },
      onDidChangeWorkspaceFolders: (callback) => {
        subscriptions.push(callback);
        return disposable();
      },
    },
  };
  const context = {
    workspaceState: {
      get: () => [],
      update: async () => {},
    },
  };
  const manager = createCustomCssManager(vscode, context);

  await manager.sync();

  assert.deepEqual(updatedStyles, [
    { value: ["existing.css", "styles/theme.css"], target: 3 },
  ]);
  assert.equal(watchers.length, 1);
  assert.equal(watchers[0].pattern.base, "/workspace/styles");
  assert.equal(watchers[0].pattern.pattern, "theme.css");
  assert.equal(subscriptions.length, 2);
  manager.dispose();
});
