import { useState } from "react";

export function useForm<T extends Record<string, string>>(defaultValues: T) {
  const [values, setValues] = useState<T>(defaultValues);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value } as T);
  };

  return { values, handleChange, setValues };
}
