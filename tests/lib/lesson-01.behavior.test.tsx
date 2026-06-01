import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ProfileForm from "../../src/components/ProfileForm/ProfileForm";

vi.mock("../../src/utils/api", () => ({
  getProfile: vi.fn(() => ({ name: "", email: "" })),
  saveProfile: vi.fn(() => Promise.resolve()),
}));

describe("Lesson 01 — controlled name input", () => {
  it("typing in the name field updates its displayed value", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);

    const nameInput = screen.getByLabelText(/name/i);
    await user.type(nameInput, "Alice");

    expect(nameInput).toHaveValue("Alice");
  });

  it("each additional character is reflected in the input", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);

    const nameInput = screen.getByLabelText(/name/i);
    await user.type(nameInput, "Hi");

    expect(nameInput).toHaveValue("Hi");

    await user.type(nameInput, "!");
    expect(nameInput).toHaveValue("Hi!");
  });
});
