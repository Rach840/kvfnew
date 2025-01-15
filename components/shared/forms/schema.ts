import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Введите корректную почту" }),
  password: z
    .string()
    .min(6, {
      message: "Пароль должен содержать минимум 6 символов",
    })
    .refine((str) => /[A-Z]/.test(str), {
      message: "Пароль должен содержать хотя бы одну заглавную букву",
    })
    .refine((str) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(str), {
      message: "Пароль должен содержать хотя бы один специальный символ",
    })
    .refine((str) => /[0-9]/.test(str), {
      message: "Пароль должен содержать хотя бы одну цифру",
    }),
});
export const loginEmailSchema = z.object({
  email: z.string().email({ message: "Введите корректную почту" }),
});
export const CreateQuestionSchema = z.object({
  name: z.string(),
});

export const CreateTestSchema = z.object({
  name: z.string(),
  nameTranslit: z.string(),
  category: z.string(),
  text: z.string(),
});

export const RegisterSchema = z.object({
  firstName: z.string().min(3, {
    message: "Имя пользователя должно содержать минимум 3 символа",
  }),
  lastName: z.string().min(3, {
    message: "Фамилия пользователя должна содержать минимум 3 символа",
  }),
  surName: z.string(),
  email: z.string().email({ message: "Введите корректную почту" }),
  password: z
    .string()
    .min(6, {
      message: "Пароль должен содержать минимум 6 символов",
    })
    .refine((str) => /[A-Z]/.test(str), {
      message: "Пароль должен содержать хотя бы одну заглавную букву",
    })
    .refine((str) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(str), {
      message: "Пароль должен содержать хотя бы один специальный символ",
    })
    .refine((str) => /[0-9]/.test(str), {
      message: "Пароль должен содержать хотя бы одну цифру",
    }),
  organisation: z.string(),
  role: z.string().min(1, {
    message: "Выберите категорию",
  }),
  startTest: z.string().min(1, {
    message: "Выберите уровень теста",
  }),
});

export type TCreateQuestionValues = z.infer<typeof CreateQuestionSchema>;
export type TCreateTestValues = z.infer<typeof CreateTestSchema>;
export type TFormLoginValues = z.infer<typeof loginSchema>;
export type TFormLoginEmailValues = z.infer<typeof loginEmailSchema>;
export type TFormRegisterValues = z.infer<typeof RegisterSchema>;
