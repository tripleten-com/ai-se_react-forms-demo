const PROFILE_KEY = 'meshAI_profile';

export type Profile = {
  name: string;
  email: string;
};

export function getProfile(): Profile {
  const stored = localStorage.getItem(PROFILE_KEY);
  return stored ? (JSON.parse(stored) as Profile) : { name: '', email: '' };
}

export function saveProfile(data: Profile): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
      resolve();
    }, 600);
  });
}
