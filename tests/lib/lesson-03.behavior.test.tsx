import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ProfileForm from "../../src/components/ProfileForm/ProfileForm";

vi.mock("../../src/utils/api", () => ({
  getProfile: vi.fn(() => Promise.resolve({ name: "", email: "" })),
  saveProfile: vi.fn(() => Promise.resolve()),
}));

describe("Lesson 03 — useForm hook", () => {
  it("both fields still update correctly after refactoring to useForm", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);

    await user.type(await screen.findByLabelText(/name/i), "Alice");
    await user.type(await screen.findByLabelText(/email/i), "alice@example.com");

    expect(screen.getByLabelText(/name/i)).toHaveValue("Alice");
    expect(screen.getByLabelText(/email/i)).toHaveValue("alice@example.com");
  });

  it("clearing a field via backspace reduces its value", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);

    const nameInput = await screen.findByLabelText(/name/i);
    await user.type(nameInput, "Hi");
    await user.type(nameInput, "{backspace}");

    expect(nameInput).toHaveValue("H");
  });
});
