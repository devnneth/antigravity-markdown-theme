const ALERT_PATTERN = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*(?:\r?\n|$)/i;
const TASK_PATTERN = /^\[([ xX])\][ \t]+/;

function addClass(token, className) {
  token.attrJoin("class", className);
}

function stripTextPrefix(inlineToken, prefixLength) {
  inlineToken.content = inlineToken.content.slice(prefixLength);

  let remaining = prefixLength;
  for (const child of inlineToken.children || []) {
    if (remaining === 0) break;
    if (child.type !== "text") continue;

    const removedLength = Math.min(remaining, child.content.length);
    child.content = child.content.slice(removedLength);
    remaining -= removedLength;
  }

  inlineToken.children = (inlineToken.children || []).filter(
    (child) => child.type !== "text" || child.content.length > 0,
  );
}

function stripAlertMarker(inlineToken, markerLength) {
  inlineToken.content = inlineToken.content.slice(markerLength);

  const children = inlineToken.children || [];
  const firstText = children.find((child) => child.type === "text");
  if (firstText) {
    firstText.content = firstText.content.replace(
      /^\[!(?:NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*/i,
      "",
    );
  }

  inlineToken.children = children.filter(
    (child) => child.type !== "text" || child.content.length > 0,
  );
  if (
    inlineToken.children[0] &&
    ["softbreak", "hardbreak"].includes(inlineToken.children[0].type)
  ) {
    inlineToken.children.shift();
  }
}

function createAlertTitle(state, type, map) {
  const paragraphOpen = new state.Token("paragraph_open", "p", 1);
  addClass(paragraphOpen, "markdown-alert-title");
  paragraphOpen.map = map ? [map[0], map[0] + 1] : null;

  const inline = new state.Token("inline", "", 0);
  inline.map = paragraphOpen.map;
  const text = new state.Token("text", "", 0);
  text.content = type;
  inline.children = [text];

  const paragraphClose = new state.Token("paragraph_close", "p", -1);
  return [paragraphOpen, inline, paragraphClose];
}

function transformAlerts(state) {
  const tokens = state.tokens;

  for (let index = 0; index < tokens.length - 2; index += 1) {
    const blockquoteOpen = tokens[index];
    const paragraphOpen = tokens[index + 1];
    const inline = tokens[index + 2];

    if (
      blockquoteOpen.type !== "blockquote_open" ||
      paragraphOpen.type !== "paragraph_open" ||
      inline.type !== "inline"
    ) {
      continue;
    }

    const match = inline.content.match(ALERT_PATTERN);
    if (!match) continue;

    const type = match[1].toUpperCase();
    addClass(blockquoteOpen, "markdown-alert");
    addClass(blockquoteOpen, `markdown-alert-${type.toLowerCase()}`);
    stripAlertMarker(inline, match[0].length);
    tokens.splice(index + 1, 0, ...createAlertTitle(state, type, blockquoteOpen.map));
    index += 3;
  }
}

function createCheckbox(state, checked) {
  const checkbox = new state.Token("html_inline", "", 0);
  checkbox.content = `<input class="task-list-item-checkbox" type="checkbox" disabled${
    checked ? " checked" : ""
  }>`;

  const space = new state.Token("text", "", 0);
  space.content = " ";
  return [checkbox, space];
}

function transformTaskLists(state) {
  const listStack = [];

  for (let index = 0; index < state.tokens.length; index += 1) {
    const token = state.tokens[index];

    if (["bullet_list_open", "ordered_list_open"].includes(token.type)) {
      listStack.push(token);
      continue;
    }
    if (["bullet_list_close", "ordered_list_close"].includes(token.type)) {
      listStack.pop();
      continue;
    }
    if (token.type !== "list_item_open") continue;

    let inline = null;
    for (let childIndex = index + 1; childIndex < state.tokens.length; childIndex += 1) {
      const child = state.tokens[childIndex];
      if (child.type === "list_item_close") break;
      if (child.type === "inline") {
        inline = child;
        break;
      }
    }
    if (!inline) continue;

    const match = inline.content.match(TASK_PATTERN);
    if (!match) continue;

    addClass(token, "task-list-item");
    if (listStack.length > 0) {
      addClass(listStack[listStack.length - 1], "contains-task-list");
    }

    stripTextPrefix(inline, match[0].length);
    inline.children.unshift(...createCheckbox(state, match[1].toLowerCase() === "x"));
  }
}

function transformDocument(state) {
  transformAlerts(state);
  transformTaskLists(state);
}

module.exports = {
  transformAlerts,
  transformDocument,
  transformTaskLists,
};
