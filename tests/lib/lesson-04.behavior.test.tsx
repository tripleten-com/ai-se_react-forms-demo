import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProfileForm from "../../src/components/ProfileForm/ProfileForm";

vi.mock("../../src/utils/api", () => ({
  getProfile: vi.fn(() => ({ name: "", email: "" })),
  saveProfile: vi.fn(() => Promise.resolve()),
}));

describe("Lesson 04 — HTML5 validation attributes", () => {
  it("name input is required", () => {
    render(<ProfileForm />);
    expect(screen.getByLabelText(/name/i)).toBeRequired();
  });

  it("name input has a minLength of 2", () => {
    render(<ProfileForm />);
    expect(screen.getByLabelText(/name/i)).toHaveAttribute("minLength", "2");
  });

  it("name input has a maxLength of 40", () => {
    render(<ProfileForm />);
    expect(screen.getByLabelText(/name/i)).toHaveAttribute("maxLength", "40");
  });

  it("email input has type='email'", () => {
    render(<ProfileForm />);
    expect(screen.getByLabelText(/email/i)).toHaveAttribute("type", "email");
  });

  it("email input is required", () => {
    render(<ProfileForm />);
    expect(screen.getByLabelText(/email/i)).toBeRequired();
  });
});
