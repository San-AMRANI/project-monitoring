import { beforeEach, describe, expect, it, vi } from "vitest";

const buildDom = () => {
  document.body.innerHTML = `
    <button id="random-btn"></button>
    <button id="all-btn"></button>
    <p id="quote-text"></p>
    <p id="quote-author"></p>
    <p id="error-message" class="hidden"></p>
    <div id="quotes-list"></div>
    <span id="quote-count"></span>
    <span id="health-indicator"></span>
  `;
};

let exportsUnderTest;

beforeEach(async () => {
  vi.resetModules();
  vi.clearAllMocks();
  buildDom();
  exportsUnderTest = await import("../app.js");
});

describe("UI helpers", () => {
  it("sets and clears errors", () => {
    const { setError } = exportsUnderTest;
    const node = document.getElementById("error-message");

    setError("Oops");
    expect(node.textContent).toBe("Oops");
    expect(node.classList.contains("hidden")).toBe(false);

    setError("");
    expect(node.textContent).toBe("");
    expect(node.classList.contains("hidden")).toBe(true);
  });

  it("renders a list of quotes and count", () => {
    const { renderList } = exportsUnderTest;
    const items = [
      { text: "A", author: "One" },
      { text: "B", author: "Two" }
    ];

    renderList(items);

    expect(document.querySelectorAll("#quotes-list article").length).toBe(2);
    expect(document.getElementById("quote-count").textContent).toBe("2 items");
  });
});

describe("Data loaders", () => {
  it("loads a random quote via fetch", async () => {
    const { loadRandom } = exportsUnderTest;
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ text: "Test quote", author: "Tester" })
    }));

    await loadRandom();

    expect(document.getElementById("quote-text").textContent).toBe("Test quote");
    expect(document.getElementById("quote-author").textContent).toContain("Tester");
  });
});
