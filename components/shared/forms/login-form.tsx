import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { loginSchema, TFormLoginValues } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "./forminput";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Alert } from "@mui/material";

interface Props {
  onClose?: VoidFunction;
}

export const LoginForm: React.FC<Props> = ({ }) => {
  const router = useRouter();
  const [isInvalid, setIsInvalid] = useState(false);
  const form = useForm<TFormLoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: TFormLoginValues) => {
    try {
      const resp = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (!resp?.ok) {
        throw Error();
      }
      router.push("/");

    } catch (error) {
      console.log(error)
      setIsInvalid(true)
    }
  };

  return (
    <FormProvider  {...form}>
      <form
        className=" bg-white container  mx-auto w-2/5 border-x-2 border-y-2 rounded-lg my-10 py-10 px-10 mx-auto  border-gray-900/10 pb-12  "
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h2 className=" text-3xl font-semibold text-gray-900">Авторизация</h2>
        <p className="mt-1 text-lg text-gray-600">
          Авторизируйся для доступа к тестам
        </p>
        {isInvalid ? (
          <Alert severity="error">Такого пользователя не существует!.</Alert>

        ) : <></>}
        <div className="mt-10 ">
          <div className="mx-auto">
            <label
              htmlFor="first-name"
              className="block text-sm/6 font-medium text-gray-900"
            ></label>
            <FormInput name="email" label="E-Mail" required />
            <FormInput
              name="password"
              label="Пароль"
              type="password"
              required
            />

            <Button
              loading={form.formState.isSubmitting}
              className="  duration-300  rounded-md bg-indigo-600 px-5 py-6 text-lg my-4 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              type="submit"
            >
              Войти
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
export default LoginForm;
