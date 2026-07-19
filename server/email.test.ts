import { describe, it, expect, vi } from "vitest";

describe("Email Service - SendGrid Configuration", () => {
  it("should have SENDGRID_API_KEY configured in environment", () => {
    // This test validates that the secret was properly set
    const apiKey = process.env.SENDGRID_API_KEY;
    expect(apiKey).toBeDefined();
    expect(apiKey).toBeTruthy();
    expect(apiKey).toMatch(/^SG\./);
  });

  it("should validate SendGrid API key format", () => {
    const apiKey = process.env.SENDGRID_API_KEY;
    // SendGrid API keys start with "SG."
    expect(apiKey).toMatch(/^SG\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$/);
  });

  it("should be able to import email module", async () => {
    const emailModule = await import("./email");
    expect(emailModule.sendEmail).toBeDefined();
    expect(emailModule.sendTrainingConfirmationEmail).toBeDefined();
    expect(typeof emailModule.sendEmail).toBe("function");
    expect(typeof emailModule.sendTrainingConfirmationEmail).toBe("function");
  });
});
