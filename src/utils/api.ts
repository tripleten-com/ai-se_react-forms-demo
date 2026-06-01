const PROFILE_KEY = "react-demo-profile";

export type Profile = {
  name: string;
  email: string;
};

export function getProfile(): Promise<Profile> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stored = localStorage.getItem(PROFILE_KEY);
      resolve(
        stored ? (JSON.parse(stored) as Profile) : { name: "", email: "" },
      );
    }, 2000);
  });
}

export function saveProfile(data: Profile): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
      resolve();
    }, 600);
  });
}
