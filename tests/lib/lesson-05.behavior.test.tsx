import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ProfileForm from "../../src/components/ProfileForm/ProfileForm";

vi.mock("../../src/utils/api", () => ({
  getProfile: vi.fn(() => Promise.resolve({ name: "", email: "" })),
  saveProfile: vi.fn(() => Promise.resolve()),
}));

describe("Lesson 05 — useFormWithValidation", () => {
  it("Save button is disabled before the user has touched any field", async () => {
    render(<ProfileForm />);
    expect(await screen.findByRole("button", { name: /save/i })).toBeDisabled();
  });

  it("Save button becomes enabled when name and email are both valid", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);

    await user.type(await screen.findByLabelText(/name/i), "Alice");
    await user.type(await screen.findByLabelText(/email/i), "alice@example.com");

    expect(screen.getByRole("button", { name: /save/i })).not.toBeDisabled();
  });

  it("Save button stays disabled when only the name field is filled", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);

    await user.type(await screen.findByLabelText(/name/i), "Alice");

    expect(screen.getByRole("button", { name: /save/i })).toBeDisabled();
  });

  it("an error message appears below the name field when the value is too short", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);

    const nameInput = await screen.findByLabelText(/name/i);
    await user.type(nameInput, "A");
    await user.clear(nameInput);
    await user.type(nameInput, "A");

    const error = screen.getAllByText(/.+/)[0];
    expect(error).toBeDefined();
  });
});
