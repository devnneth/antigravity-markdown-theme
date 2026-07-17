const { createCustomCssManager } = require("./src/custom-css-manager");
const { transformDocument } = require("./src/markdown-transform");

function extendMarkdownIt(markdownIt) {
  markdownIt.core.ruler.after("block", "antigravity-markdown-theme", transformDocument);
  return markdownIt;
}

function activate(context) {
  const vscode = require("vscode");
  const customCssManager = createCustomCssManager(vscode, context);
  context.subscriptions.push(customCssManager);
  void customCssManager.sync();

  return { extendMarkdownIt };
}

module.exports = {
  activate,
  extendMarkdownIt,
};
