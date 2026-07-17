const assert = require("node:assert/strict");
const test = require("node:test");
const { transformDocument } = require("../src/markdown-transform");

class Token {
  constructor(type, tag = "", nesting = 0) {
    this.type = type;
    this.tag = tag;
    this.nesting = nesting;
    this.attrs = [];
    this.content = "";
    this.children = [];
    this.map = null;
  }

  attrJoin(name, value) {
    const attribute = this.attrs.find(([attributeName]) => attributeName === name);
    if (attribute) attribute[1] += ` ${value}`;
    else this.attrs.push([name, value]);
  }

  classes() {
    return (this.attrs.find(([name]) => name === "class") || [null, ""])[1];
  }
}

function text(content) {
  const token = new Token("text");
  token.content = content;
  return token;
}

function inline(content, children) {
  const token = new Token("inline");
  token.content = content;
  token.children = children;
  return token;
}

test("converts a GitHub alert and leaves its body intact", () => {
  const open = new Token("blockquote_open", "blockquote", 1);
  open.map = [37, 39];
  const body = inline("[!NOTE]\nbody text", [
    text("[!NOTE]"),
    new Token("softbreak", "br"),
    text("body text"),
  ]);
  const state = {
    Token,
    tokens: [
      open,
      new Token("paragraph_open", "p", 1),
      body,
      new Token("paragraph_close", "p", -1),
      new Token("blockquote_close", "blockquote", -1),
    ],
  };

  transformDocument(state);

  assert.match(open.classes(), /markdown-alert-note/);
  assert.equal(state.tokens[2].content, "");
  assert.equal(state.tokens[2].children[0].content, "NOTE");
  assert.equal(body.content, "body text");
  assert.deepEqual(body.children.map((child) => child.content), ["body text"]);
});

test("does not convert an ordinary blockquote", () => {
  const open = new Token("blockquote_open", "blockquote", 1);
  const body = inline("normal blockquote", [text("normal blockquote")]);
  const state = {
    Token,
    tokens: [
      open,
      new Token("paragraph_open", "p", 1),
      body,
      new Token("paragraph_close", "p", -1),
      new Token("blockquote_close", "blockquote", -1),
    ],
  };

  transformDocument(state);

  assert.equal(open.classes(), "");
  assert.equal(body.content, "normal blockquote");
});

test("converts checked and unchecked task list items", () => {
  const list = new Token("bullet_list_open", "ul", 1);
  const checkedItem = new Token("list_item_open", "li", 1);
  const checked = inline("[x] done", [text("[x] done")]);
  const uncheckedItem = new Token("list_item_open", "li", 1);
  const unchecked = inline("[ ] pending", [text("[ ] pending")]);
  const state = {
    Token,
    tokens: [
      list,
      checkedItem,
      new Token("paragraph_open", "p", 1),
      checked,
      new Token("paragraph_close", "p", -1),
      new Token("list_item_close", "li", -1),
      uncheckedItem,
      new Token("paragraph_open", "p", 1),
      unchecked,
      new Token("paragraph_close", "p", -1),
      new Token("list_item_close", "li", -1),
      new Token("bullet_list_close", "ul", -1),
    ],
  };

  transformDocument(state);

  assert.match(list.classes(), /contains-task-list/);
  assert.match(checkedItem.classes(), /task-list-item/);
  assert.match(checked.children[0].content, / checked>/);
  assert.equal(checked.content, "done");
  assert.doesNotMatch(unchecked.children[0].content, / checked>/);
  assert.equal(unchecked.content, "pending");
});
