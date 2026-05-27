import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string({ message: "Name must be in String" })
    .max(8, { message: "Maximum length should 8." })
    .min(4, { message: "Minimum length should 4." }),
  email: z.email({ message: "Must be an Email." }).trim(),
  password: z
    .string({ message: "String Required." })
    .min(8, { message: "Minimum 8 length." })
    .max(12, { message: "Maximun 12 length." })
    .regex(/[a-z]/, { message: "Contain atleast one lowercase letter." })
    .regex(/[A-Z]/, { message: "Contain at least one Uppercase letter." })
    .regex(/[0-9]/, { message: "Password should contain atleast one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "The password should contain atleast one Special character.",
    })
    .trim(),
});

export type registerFormSchema = z.infer<typeof registerSchema>;
