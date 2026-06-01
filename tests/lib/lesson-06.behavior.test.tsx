import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ProfileForm from "../../src/components/ProfileForm/ProfileForm";
import * as api from "../../src/utils/api";

vi.mock("../../src/utils/api", () => ({
  getProfile: vi.fn(() => Promise.resolve({ name: "", email: "" })),
  saveProfile: vi.fn(() => Promise.resolve()),
}));

<<<<<<< Updated upstream
async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/name/i), "Alice");
  await user.type(screen.getByLabelText(/email/i), "alice@example.com");
}
=======
describe("Lesson 05 — useFormWithValidation", () => {
  it("Save button is disabled before the user has touched any field", async () => {
    render(<ProfileForm />);
    expect(await screen.findByRole("button", { name: /save/i })).toBeDisabled();
  });
>>>>>>> Stashed changes

describe("Lesson 06 — form submission", () => {
  it("Save button is disabled while the request is in flight", async () => {
    vi.mocked(api.saveProfile).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 50))
    );
    const user = userEvent.setup();
    render(<ProfileForm />);
    await fillValidForm(user);

<<<<<<< Updated upstream
    const saveButton = screen.getByRole("button", { name: /save/i });
    user.click(saveButton);
=======
    await user.type(await screen.findByLabelText(/name/i), "Alice");
    await user.type(await screen.findByLabelText(/email/i), "alice@example.com");
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
    user.click(screen.getByRole("button", { name: /save/i }));
=======
    await user.type(await screen.findByLabelText(/name/i), "Alice");
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
    await user.click(screen.getByRole("button", { name: /save/i }));
=======
    const nameInput = await screen.findByLabelText(/name/i);
    await user.type(nameInput, "A");
    await user.clear(nameInput);
    await user.type(nameInput, "A");
>>>>>>> Stashed changes

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
