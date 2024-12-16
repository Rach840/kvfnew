import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "@/app/actions";
import { TFormRegisterValues, RegisterSchema } from "./schema";
import { FormInput } from "./forminput";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,

  FormMessage,
} from "@/components/ui/form";

export const RegisterForm: React.FC = ({ }) => {
  const router = useRouter();
  const form = useForm<TFormRegisterValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      surName: "",
      email: "",
      password: "",
      startTest: "",
      organisation: "",
      role: "",
    },
  });

  const onSubmit = async (data: TFormRegisterValues) => {
    console.log(data);
    const result = await registerUser({
      firstName: data.firstName,
      lastName: data.lastName,
      surName: data.surName ? data.surName : "",
      email: data.email,
      password: data.password,
      startTest: data.startTest,
      organisation: data.organisation ? data.organisation : "",
      role: data.role,
      okAnswers: 0,
      testsResult: "[]",
    });
    console.log({ result });
    try {
      if (result.success) {
        signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        }).then(() => router.push("/"));
      } else {
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <FormProvider {...form}>
      <form
        className="flex border-x-2 container mx-auto px-10 bg-white border-y-2 rounded-lg   border-gray-900/10 pb-12 flex-col "
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className=" container   mx-auto">
          <div className=" my-4 py-10 ">
            <h2 className=" text-3xl font-semibold text-gray-900">
              Регистрация
            </h2>
            <p className="mt-1 text-sm/6 text-gray-600">
              Зарегистрируетесь для доступа к тестам
            </p>
            <div className="flex">
              <div className="mt-10 w-9/12 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="first-name"
                    className="block text-sm/6 font-medium text-gray-900"
                  ></label>
                  <div className="mt-2">
                    <FormInput name="firstName" label="Имя" required />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="last-name"
                    className="block text-sm/6 font-medium text-gray-900"
                  ></label>
                  <div className="mt-2">
                    <FormInput name="lastName" label="Фамилия" required />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="sur-name"
                    className="block text-sm/6 font-medium text-gray-900"
                  ></label>
                  <div className="mt-2">
                    <FormInput name="surName" label="Отчество" required />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="email"
                    className="block text-sm/6 font-medium text-gray-900"
                  ></label>
                  <div className="mt-2">
                    <FormInput
                      name="email"
                      label="Адрес электронной почты"
                      required
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="email"
                    className="block text-sm/6 font-medium text-gray-900"
                  ></label>
                  <div className="mt-2">
                    <FormInput
                      name="password"
                      label="Пароль"
                      type="password"
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="country"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Категория
                  </label>
                  <div className="mt-2 grid grid-cols-1">
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="STUDENT">Студент</SelectItem>
                              <SelectItem value="SCHOOLBOY">
                                Школьник
                              </SelectItem>
                              <SelectItem value="SPECIALIST">
                                Специалист
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-500 text-sm mt-1" />
                        </FormItem>
                      )}
                    />
                    { }
                  </div>
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="country"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Категория начального теста
                    </label>
                    <div className="mt-2 grid grid-cols-1">
                      <FormField
                        control={form.control}
                        name="startTest"
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="TRAINING">
                                  Тренировочный
                                </SelectItem>
                                <SelectItem value="QUALIFYING">
                                  Отборочный
                                </SelectItem>
                                <SelectItem value="BASIC">Основной</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-500 text-sm mt-1" />
                          </FormItem>
                        )}
                      />
                      { }
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="organisation"
                    className="block text-sm/6 font-medium text-gray-900"
                  ></label>
                  <div className="mt-2">
                    <FormInput
                      name="organisation"
                      label="Организация"
                      required
                    />
                  </div>
                </div>

                <Button
                  loading={form.formState.isSubmitting}
                  variant={"secondary"}
                  className="duration-300 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  type="submit"
                >
                  Зарегистрироваться
                </Button>
              </div>
              <img
                src="../registr.png"
                className="mx-auto mt-10 h-1/4 w-2/12"
              />
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
