import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ProfileForm from "../../src/components/ProfileForm/ProfileForm";

vi.mock("../../src/utils/api", () => ({
  getProfile: vi.fn(() => Promise.resolve({ name: "", email: "" })),
  saveProfile: vi.fn(() => Promise.resolve()),
}));

describe("Lesson 03 — multiple inputs with one handler", () => {
  it("typing in the name field updates its value", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);

    const nameInput = await screen.findByLabelText(/name/i);
    await user.type(nameInput, "Alice");

    expect(nameInput).toHaveValue("Alice");
    expect(nameInput).toHaveAttribute("value", "Alice");
  });

  it("typing in the email field updates its value", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);

    const emailInput = await screen.findByLabelText(/email/i);
    await user.type(emailInput, "alice@example.com");

    expect(emailInput).toHaveValue("alice@example.com");
    expect(emailInput).toHaveAttribute("value", "alice@example.com");
  });

  it("typing in name does not affect the email field", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);

    const nameInput = await screen.findByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);

    await user.type(nameInput, "Alice");

    expect(emailInput).toHaveValue("");
    expect(emailInput).toHaveAttribute("value", "");
  });

  it("typing in email does not affect the name field", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);

    const nameInput = await screen.findByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);

    await user.type(emailInput, "alice@example.com");

    expect(nameInput).toHaveValue("");
    expect(nameInput).toHaveAttribute("value", "");
  });
});
