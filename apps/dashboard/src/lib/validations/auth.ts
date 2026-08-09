import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "L'email est requis")
  .pipe(z.email("Adresse email invalide"));

export const passwordSchema = z
  .string()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères")
  .max(72, "Le mot de passe ne peut pas dépasser 72 caractères")
  .regex(/[a-z]/, "Le mot de passe doit contenir une lettre minuscule")
  .regex(/[A-Z]/, "Le mot de passe doit contenir une lettre majuscule")
  .regex(/[0-9]/, "Le mot de passe doit contenir un chiffre");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Le mot de passe est requis"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Le nom doit contenir au moins 2 caractères")
      .max(100, "Le nom ne peut pas dépasser 100 caractères"),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Jeton invalide"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
