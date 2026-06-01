import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProfileForm from "../../src/components/ProfileForm/ProfileForm";
import * as api from "../../src/utils/api";

vi.mock("../../src/utils/api", () => ({
  getProfile: vi.fn(() => ({ name: "", email: "" })),
  saveProfile: vi.fn(() => Promise.resolve()),
}));

describe("Lesson 07 — pre-filling fields from data", () => {
  it("shows a loading state before the profile data arrives", () => {
    render(<ProfileForm />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders the form after the profile loads", async () => {
    render(<ProfileForm />);
    expect(await screen.findByLabelText(/name/i)).toBeInTheDocument();
  });

  it("pre-fills the name field with stored profile data", async () => {
    vi.mocked(api.getProfile).mockReturnValue({
      name: "Alice",
      email: "alice@example.com",
    });
    render(<ProfileForm />);

    expect(await screen.findByDisplayValue("Alice")).toBeInTheDocument();
  });

  it("pre-fills the email field with stored profile data", async () => {
    vi.mocked(api.getProfile).mockReturnValue({
      name: "Alice",
      email: "alice@example.com",
    });
    render(<ProfileForm />);

    expect(
      await screen.findByDisplayValue("alice@example.com")
    ).toBeInTheDocument();
  });

  it("shows empty fields when there is no stored profile", async () => {
    vi.mocked(api.getProfile).mockReturnValue({ name: "", email: "" });
    render(<ProfileForm />);

    const nameInput = await screen.findByLabelText(/name/i);
    expect(nameInput).toHaveValue("");
  });
});
