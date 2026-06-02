import { useState } from "react";

import "./ProfileForm.css";

export default function ProfileForm() {
  const [formData, setFormData] = useState({ name: "", email: "" });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  return (
    <form className="profile-form">
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
          value={formData.name}
          onChange={handleChange}
          name="name"
        />
      </div>

      <div className="profile-form__field">
        <label className="profile-form__label" htmlFor="email">
          Email
        </label>
        <input
          className="profile-form__input"
          id="email"
          type="text"
          placeholder="johndoe@example.com"
          value={formData.email}
          onChange={handleChange}
          name="email"
        />
      </div>

      <button className="profile-form__save-btn" type="submit">
        Save
      </button>
    </form>
  );
}
