const assert = require("node:assert/strict");
const test = require("node:test");
const { extendMarkdownIt } = require("../extension");

test("registers the Markdown transform after block parsing", () => {
  let registration;
  const markdownIt = {
    core: {
      ruler: {
        after: (...args) => {
          registration = args;
        },
      },
    },
  };

  assert.equal(extendMarkdownIt(markdownIt), markdownIt);
  assert.equal(registration[0], "block");
  assert.equal(registration[1], "antigravity-markdown-theme");
  assert.equal(typeof registration[2], "function");
});
