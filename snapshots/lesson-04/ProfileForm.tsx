import { useForm } from "../../hooks/useForm";
import "./ProfileForm.css";

export default function ProfileForm() {
  const { values, handleChange } = useForm({ name: "", email: "" });

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
          value={values.name}
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
          value={values.email}
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
