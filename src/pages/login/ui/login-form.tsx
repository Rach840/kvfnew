import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { loginEmailSchema, loginSchema, TFormLoginEmailValues, TFormLoginValues } from "../../../shared/model/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "../../../../components/shared/forms/forminput";
import { Button } from "@/src/shared/ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Alert } from "@mui/material";
import Link from "next/link";


interface Props {
  variant?: string;
  onClose?: VoidFunction;
}

export const LoginForm: React.FC<Props> = ({ variant }) => {
  const router = useRouter();
  const [isInvalid, setIsInvalid] = useState(false);
  const form = useForm<TFormLoginValues | TFormLoginEmailValues>({
    resolver: zodResolver(variant === 'email' ? loginEmailSchema : loginSchema),
    defaultValues: variant === 'email' ? { email: "" } : { email: "", password: "" },
  });
  const onSubmit = async (data: TFormLoginValues | TFormLoginEmailValues) => {
    try {
      const email = data.email;
      const resp = (variant == 'email') ? await signIn('email', {
        email,
        redirect: false,
      }) : await signIn('credentials', {
        ...data,
        redirect: false,
      });

      if (!resp?.ok) {
        throw Error();
      }
      if (variant == 'email') {
        router.replace("/verification-request")
      } else {
        router.replace("/");

      }

    } catch (error) {
      console.log(error)
      setIsInvalid(true)
    }
  };

  return (
    <FormProvider  {...form}>
      <form
        className=" bg-white container w-full  mx-auto lg:w-2/5 border-x-2 border-y-2 rounded-lg my-10 py-10 px-10 mx-auto  border-gray-900/10 pb-12  "
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
            <FormInput className="my-3" name="email" label="E-Mail" required />
            {variant != 'email' ? <FormInput
              name="password"
              label="Пароль"
              type="password"
              required
            /> : ''}

            <div className="flex justify-between items-center">
              <Button
                loading={form.formState.isSubmitting}
                className="  duration-300  rounded-md bg-indigo-600 px-5 py-6 text-lg my-4 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                type="submit"
              >
                Войти
              </Button>
              {variant != 'email' ? <Link

                className="  duration-300  rounded-md bg-zinc-800 px-5 py-3 text-sm my-4 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                href="/login-with-email"
              >
                Войти по электронной почте
              </Link> : ''}
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
export default LoginForm;
