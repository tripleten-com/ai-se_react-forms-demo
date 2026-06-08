import { useState, useEffect } from "react";
import { useFormWithValidation } from "../../hooks/useFormWithValidation";
import { saveProfile, getProfile } from "../../utils/api";
import "./ProfileForm.css";

export default function ProfileForm() {
  const { values, handleChange, errors, isValid, setValues } =
    useFormWithValidation({
      name: "",
      email: "",
    });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProfile();
        setValues(data);
      } finally {
        setIsLoadingProfile(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);

    try {
      await saveProfile(values);
      setSubmitSuccess(true);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return isLoadingProfile ? (
    <p>Loading...</p>
  ) : (
    <form className="profile-form" onSubmit={handleSubmit}>
      <h1 className="profile-form__title">Your Profile</h1>

      <div className="profile-form__field">
        <label className="profile-form__label" htmlFor="name">
          Name
        </label>
        <input
          className="profile-form__input"
          id="name"
          type="text"
          placeholder="John Doe"
          value={values.name}
          onChange={handleChange}
          name="name"
          required
          minLength={2}
          maxLength={40}
        />
        {errors.name && (
          <span className="profile-form__error">{errors.name}</span>
        )}
      </div>

      <div className="profile-form__field">
        <label className="profile-form__label" htmlFor="email">
          Email
        </label>
        <input
          className="profile-form__input"
          id="email"
          type="email"
          placeholder="johndoe@example.com"
          value={values.email}
          onChange={handleChange}
          name="email"
          required
        />
        {errors.email && (
          <span className="profile-form__error">{errors.email}</span>
        )}
      </div>

      <button
        className="profile-form__save-btn"
        type="submit"
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save"}
      </button>
      {submitError && (
        <span className="profile-form__error">{submitError}</span>
      )}
      {submitSuccess && <span>Submission successful</span>}
    </form>
  );
}
