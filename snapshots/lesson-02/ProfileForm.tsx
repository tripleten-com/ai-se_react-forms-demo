import { useState } from "react";

import "./ProfileForm.css";

export default function ProfileForm() {
  const [name, setName] = useState("");

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
          value={name}
          onChange={(e) => setName(e.target.value)}
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
        />
      </div>

      <button className="profile-form__save-btn" type="submit">
        Save
      </button>
    </form>
  );
}
