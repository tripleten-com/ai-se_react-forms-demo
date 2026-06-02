import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ProfileForm from "../../src/components/ProfileForm/ProfileForm";

vi.mock("../../src/utils/api", () => ({
  getProfile: vi.fn(() => Promise.resolve({ name: "", email: "" })),
  saveProfile: vi.fn(() => Promise.resolve()),
}));

describe("Lesson 02 — multiple inputs with one handler", () => {
  it("typing in the name field updates its value", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);

    await user.type(await screen.findByLabelText(/name/i), "Alice");

    expect(screen.getByLabelText(/name/i)).toHaveValue("Alice");
  });

  it("typing in the email field updates its value", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);

    await user.type(await screen.findByLabelText(/email/i), "alice@example.com");

    expect(screen.getByLabelText(/email/i)).toHaveValue("alice@example.com");
  });

  it("typing in name does not affect the email field", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);

    await user.type(await screen.findByLabelText(/name/i), "Alice");

    expect(screen.getByLabelText(/email/i)).toHaveValue("");
  });

  it("typing in email does not affect the name field", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);

    await user.type(await screen.findByLabelText(/email/i), "alice@example.com");

    expect(screen.getByLabelText(/name/i)).toHaveValue("");
  });
});
