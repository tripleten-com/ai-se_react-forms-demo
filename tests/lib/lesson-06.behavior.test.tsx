import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ProfileForm from "../../src/components/ProfileForm/ProfileForm";
import * as api from "../../src/utils/api";

vi.mock("../../src/utils/api", () => ({
  getProfile: vi.fn(() => ({ name: "", email: "" })),
  saveProfile: vi.fn(() => Promise.resolve()),
}));

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/name/i), "Alice");
  await user.type(screen.getByLabelText(/email/i), "alice@example.com");
}

describe("Lesson 06 — form submission", () => {
  it("Save button is disabled while the request is in flight", async () => {
    vi.mocked(api.saveProfile).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 50))
    );
    const user = userEvent.setup();
    render(<ProfileForm />);
    await fillValidForm(user);

    const saveButton = screen.getByRole("button", { name: /save/i });
    user.click(saveButton);

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled()
    );
  });

  it("button label changes while submitting", async () => {
    vi.mocked(api.saveProfile).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 50))
    );
    const user = userEvent.setup();
    render(<ProfileForm />);
    await fillValidForm(user);

    user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /saving/i })
      ).toBeInTheDocument()
    );
  });

  it("a success message appears after the save resolves", async () => {
    vi.mocked(api.saveProfile).mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<ProfileForm />);
    await fillValidForm(user);

    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/saved|success|profile updated/i)
      ).toBeInTheDocument()
    );
  });

  it("saveProfile is called with the current form values", async () => {
    vi.mocked(api.saveProfile).mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<ProfileForm />);
    await fillValidForm(user);

    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(api.saveProfile).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Alice", email: "alice@example.com" })
    );
  });
});
