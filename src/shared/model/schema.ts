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
const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

export const RegisterSchema = z.object({
  firstName: z.string().min(3, {
    message: "Имя пользователя должно содержать минимум 3 символа",
  }),
  lastName: z.string().min(3, {
    message: "Фамилия пользователя должна содержать минимум 3 символа",
  }),
  surName: z.string(),
  email: z.string().email({ message: "Введите корректную почту" }),
  nameTeam:z.string().min(4, {
    message: "Название команды должно содержать минимум 4 символа",
  }),
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
  vkUrl: z.string().url({message: 'Введите корректный url'}),
  startTest: z.string().min(1, {
    message: "Выберите уровень теста",
  }),
  region: z.string().min(3, {
    message: "Регион команды должна содержать минимум 3 символа",
  }),
  city: z.string().min(3, {
    message: "Город команды должна содержать минимум 3 символа",
  }),
  country: z.string().min(1, {
    message: "Выберите страну",
  }),
  phone: z.string().regex(phoneRegex, {message: "Введите корректный номер телефона",}),
});
export const JoinTeamSchema = z.object({
  key: z.string().min(3,{message:'Введите ключ'}),
});

export const RegisterTeamSchema = z.object({
  name: z.string().min(3, {
    message: "Имя команды должно содержать минимум 3 символа",
  }),
  region: z.string().min(3, {
    message: "Регион команды должна содержать минимум 3 символа",
  }),
  city: z.string().min(3, {
    message: "Город команды должна содержать минимум 3 символа",
  }),
  institution: z.string().min(3, {
    message: "Организация команды должна содержать минимум 3 символа",
  }),
  country: z.string().min(1, {
    message: "Выберите страну",
  }),
  supervisorFullName:  z.string().refine((str) => /^([А-ЯA-Z]|[А-ЯA-Z][\x27а-яa-z]{1,}|[А-ЯA-Z][\x27а-яa-z]{1,}\-([А-ЯA-Z][\x27а-яa-z]{1,}|(оглы)|(кызы)))\040[А-ЯA-Z][\x27а-яa-z]{1,}(\040[А-ЯA-Z][\x27а-яa-z]{1,})?$/.test(str), {message: 'Введите корректное ФИО'}),
  captainFullName: z.string().refine((str) => /^([А-ЯA-Z]|[А-ЯA-Z][\x27а-яa-z]{1,}|[А-ЯA-Z][\x27а-яa-z]{1,}\-([А-ЯA-Z][\x27а-яa-z]{1,}|(оглы)|(кызы)))\040[А-ЯA-Z][\x27а-яa-z]{1,}(\040[А-ЯA-Z][\x27а-яa-z]{1,})?$/.test(str), {message: 'Введите корректное ФИО'}),
  supervisorPhone: z.string().regex(phoneRegex, {message: "Введите корректный номер телефона",}),
  captainPhone: z.string().regex(phoneRegex, {message: "Введите корректный номер телефона",}),
  supervisorEmail: z.string().email({ message: "Введите корректную почту" }),
  captainEmail: z.string().email({ message: "Введите корректную почту" }),
  vkGroupUrl: z.string().url({message: 'Введите корректный url'})
});
export type TCreateQuestionValues = z.infer<typeof CreateQuestionSchema>;
export type TCreateTestValues = z.infer<typeof CreateTestSchema>;
export type TFormLoginValues = z.infer<typeof loginSchema>;
export type TFormLoginEmailValues = z.infer<typeof loginEmailSchema>;
export type TFormRegisterValues = z.infer<typeof RegisterSchema>;
export type TFormRegisterTeamValues = z.infer<typeof RegisterTeamSchema>;
export type TFormJoinValues = z.infer<typeof JoinTeamSchema>;
