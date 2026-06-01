import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProfileForm from "../../src/components/ProfileForm/ProfileForm";
import * as api from "../../src/utils/api";

vi.mock("../../src/utils/api", () => ({
  getProfile: vi.fn(() => Promise.resolve({ name: "", email: "" })),
  saveProfile: vi.fn(() => Promise.resolve()),
}));

<<<<<<< Updated upstream
describe("Lesson 07 — pre-filling fields from data", () => {
  it("shows a loading state before the profile data arrives", () => {
=======
async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(await screen.findByLabelText(/name/i), "Alice");
  await user.type(await screen.findByLabelText(/email/i), "alice@example.com");
}

describe("Lesson 06 — form submission", () => {
  it("Save button is disabled while the request is in flight", async () => {
    vi.mocked(api.saveProfile).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 50))
    );
    const user = userEvent.setup();
>>>>>>> Stashed changes
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
