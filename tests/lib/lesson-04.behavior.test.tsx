import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ProfileForm from "../../src/components/ProfileForm/ProfileForm";

vi.mock("../../src/utils/api", () => ({
  getProfile: vi.fn(() => Promise.resolve({ name: "", email: "" })),
  saveProfile: vi.fn(() => Promise.resolve()),
}));

describe("Lesson 04 — useForm hook", () => {
  it("both fields still update correctly after refactoring to useForm", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);

    const nameInput = await screen.findByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);

    await user.clear(nameInput);
    await user.clear(emailInput);

    expect(nameInput).toHaveValue("");
    expect(emailInput).toHaveValue("");

    await user.type(nameInput, "Alice");
    await user.type(emailInput, "alice@example.com");

    expect(nameInput).toHaveValue("Alice");
    expect(emailInput).toHaveValue("alice@example.com");
  });

  it("clearing a field via backspace reduces its value", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);

    const nameInput = await screen.findByLabelText(/name/i);
    await user.clear(nameInput);
    await user.type(nameInput, "Hi");
    await user.type(nameInput, "{backspace}");

    expect(nameInput).toHaveValue("H");
  });
});
