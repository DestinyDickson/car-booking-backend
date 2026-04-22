describe("Route files", () => {
  it("should import auth routes", async () => {
    const mod = await import("../src/presentation/routes/authRoutes");
    expect(mod.default).toBeDefined();
  });

  it("should import booking routes", async () => {
    const mod = await import("../src/presentation/routes/bookingRoutes");
    expect(mod.default).toBeDefined();
  });

  it("should import car routes", async () => {
    const mod = await import("../src/presentation/routes/carRoutes");
    expect(mod.default).toBeDefined();
  });
});