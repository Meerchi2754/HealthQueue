import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ message: "Please enter Email" }).trim(),
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

export type loginInputSchema = z.infer<typeof loginSchema>;
