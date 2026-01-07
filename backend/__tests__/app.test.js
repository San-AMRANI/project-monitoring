const request = require("supertest");
const app = require("../app");

describe("API", () => {
  it("returns health status", async () => {
    const response = await request(app).get("/health").expect(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("returns all quotes with count", async () => {
    const response = await request(app).get("/quotes").expect(200);
    expect(response.body.count).toBeGreaterThan(0);
    expect(Array.isArray(response.body.quotes)).toBe(true);
  });

  it("returns a random quote", async () => {
    const response = await request(app).get("/quotes/random").expect(200);
    expect(response.body).toHaveProperty("text");
    expect(response.body).toHaveProperty("author");
  });
});
