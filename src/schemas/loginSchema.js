import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid medical ID email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});