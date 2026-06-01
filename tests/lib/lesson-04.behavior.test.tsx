import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProfileForm from "../../src/components/ProfileForm/ProfileForm";

vi.mock("../../src/utils/api", () => ({
  getProfile: vi.fn(() => Promise.resolve({ name: "", email: "" })),
  saveProfile: vi.fn(() => Promise.resolve()),
}));

describe("Lesson 04 — HTML5 validation attributes", () => {
  it("name input is required", async () => {
    render(<ProfileForm />);
    expect(await screen.findByLabelText(/name/i)).toBeRequired();
  });

  it("name input has a minLength of 2", async () => {
    render(<ProfileForm />);
    expect(await screen.findByLabelText(/name/i)).toHaveAttribute("minLength", "2");
  });

  it("name input has a maxLength of 40", async () => {
    render(<ProfileForm />);
    expect(await screen.findByLabelText(/name/i)).toHaveAttribute("maxLength", "40");
  });

  it("email input has type='email'", async () => {
    render(<ProfileForm />);
    expect(await screen.findByLabelText(/email/i)).toHaveAttribute("type", "email");
  });

  it("email input is required", async () => {
    render(<ProfileForm />);
    expect(await screen.findByLabelText(/email/i)).toBeRequired();
  });
});
