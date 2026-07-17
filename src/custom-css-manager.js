const path = require("node:path");

const CUSTOM_CSS_SETTING = "customCss";
const EXTENSION_CONFIGURATION = "antigravityMarkdownTheme";
const MANAGED_STYLES_KEY_PREFIX = "managedMarkdownStyles:";
const PREVIEW_REFRESH_COMMAND = "markdown.preview.refresh";

function normalizeCssPaths(value) {
  const values = typeof value === "string" ? [value] : value;
  if (!Array.isArray(values)) return [];

  return [
    ...new Set(
      values
        .filter((item) => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ];
}

function mergeManagedStyles(currentStyles, previousManagedStyles, nextManagedStyles) {
  const previous = new Set(normalizeCssPaths(previousManagedStyles));
  const unmanaged = normalizeCssPaths(currentStyles).filter((style) => !previous.has(style));
  const nextManaged = normalizeCssPaths(nextManagedStyles).filter(
    (style) => !unmanaged.includes(style),
  );
  return [...unmanaged, ...nextManaged];
}

function arraysEqual(left, right) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function isRemoteCssPath(cssPath) {
  return /^[a-z][a-z\d+.-]*:\/\//i.test(cssPath) && !cssPath.startsWith("file://");
}

function resolveLocalCssPath(vscode, folder, cssPath) {
  if (cssPath.startsWith("file://")) return vscode.Uri.parse(cssPath).fsPath;
  if (path.isAbsolute(cssPath)) return cssPath;
  return vscode.Uri.joinPath(folder.uri, cssPath).fsPath;
}

// ==================================================================================================
// 설정된 사용자 지정 CSS 스타일 읽기
// ==================================================================================================
function readConfiguredStyles(vscode, resource) {
  const configuration = vscode.workspace.getConfiguration(
    EXTENSION_CONFIGURATION,
    resource,
  );
  return normalizeCssPaths(
    configuration.get(CUSTOM_CSS_SETTING, []),
  );
}

function createCustomCssManager(vscode, context) {
  let watchers = [];
  let refreshTimer;

  function scheduleRefresh() {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => {
      vscode.commands.executeCommand(PREVIEW_REFRESH_COMMAND);
    }, 75);
  }

  function disposeWatchers() {
    for (const watcher of watchers) watcher.dispose();
    watchers = [];
  }

  function createWatcher(folder, cssPath) {
    if (isRemoteCssPath(cssPath)) return;

    const filePath = resolveLocalCssPath(vscode, folder, cssPath);
    const watcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(path.dirname(filePath), path.basename(filePath)),
    );
    watcher.onDidChange(scheduleRefresh);
    watcher.onDidCreate(scheduleRefresh);
    watcher.onDidDelete(scheduleRefresh);
    watchers.push(watcher);
  }

  async function syncFolder(folder) {
    const resource = folder.uri;
    const configuredStyles = readConfiguredStyles(vscode, resource);
    const storageKey = `${MANAGED_STYLES_KEY_PREFIX}${resource.toString()}`;
    const previousManagedStyles = context.workspaceState.get(storageKey, []);
    const markdownConfiguration = vscode.workspace.getConfiguration("markdown", resource);
    const currentStyles = normalizeCssPaths(markdownConfiguration.get("styles", []));
    const nextStyles = mergeManagedStyles(
      currentStyles,
      previousManagedStyles,
      configuredStyles,
    );

    if (!arraysEqual(currentStyles, nextStyles)) {
      await markdownConfiguration.update(
        "styles",
        nextStyles,
        vscode.ConfigurationTarget.WorkspaceFolder,
      );
    }
    await context.workspaceState.update(storageKey, configuredStyles);

    for (const cssPath of configuredStyles) createWatcher(folder, cssPath);
  }

  async function sync() {
    disposeWatchers();
    for (const folder of vscode.workspace.workspaceFolders || []) {
      await syncFolder(folder);
    }
    scheduleRefresh();
  }

  function syncSafely() {
    return sync().catch((error) => {
      vscode.window.showWarningMessage(
        `Failed to apply Antigravity Markdown Theme custom CSS: ${error.message}`,
      );
    });
  }

  const configurationSubscription = vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration(`${EXTENSION_CONFIGURATION}.${CUSTOM_CSS_SETTING}`)) {
      void syncSafely();
    }
  });
  const foldersSubscription = vscode.workspace.onDidChangeWorkspaceFolders(() => {
    void syncSafely();
  });

  return {
    sync: syncSafely,
    dispose() {
      clearTimeout(refreshTimer);
      disposeWatchers();
      configurationSubscription.dispose();
      foldersSubscription.dispose();
    },
  };
}

module.exports = {
  arraysEqual,
  createCustomCssManager,
  isRemoteCssPath,
  mergeManagedStyles,
  normalizeCssPaths,
  readConfiguredStyles,
  resolveLocalCssPath,
};
