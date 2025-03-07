import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "@/src/app/actions";
import { TFormRegisterValues, RegisterSchema } from "../../../shared/model/schema";
import { FormInput } from "../../../../components/shared/forms/forminput";
import { Button } from "@/src/shared/ui/button";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/ui/select";
import {
  FormControl, FormDescription,
  FormField,
  FormItem, FormLabel,

  FormMessage,
} from "@/src/shared/ui/form";
import {Checkbox} from "@/src/shared/ui/checkbox";
import Link from "next/link";


export const RegisterForm: React.FC = ({ }) => {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.replace("/");
    }
  }, [session, router]);

  const form = useForm<TFormRegisterValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      surName: "",
      email: "",
      password: "",
      startTest: "START",
      organisation: "",
      vkUrl: "",
      nameTeam: "",
      region: "",
      phone: "",
      country: "",
      city: "",
    },
  });
  console.log(useSession())
  const onSubmit = async (data: TFormRegisterValues) => {
    console.log(data);
    const result = await registerUser({
      firstName: data.firstName,
      lastName: data.lastName,
      surName: data.surName ? data.surName : "",
      email: data.email,
      nameTeam: data.nameTeam,
      region: data.region,
      phone: data.phone,
      country: data.country,
      city: data.city,
      password: data.password,
      startTest: data.startTest,
      organisation: data.organisation ? data.organisation : "",
      okAnswers: 0,
      testsResult: "[]",
      vkUrl: data.vkUrl,
    });

    try {
      if (result.success) {
        signIn('email', {
          email: data.email,
          password: data.password,
          redirect: false,
        }).then(() => router.replace("/verification-request"));
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
            <div className="flex flex-col-reverse justify-center lg:flex-row">
              <div className="mt-10 w-full lg:w-9/12 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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
                      htmlFor="nameTeam"
                      className="block text-sm/6 font-medium text-gray-900"
                  ></label>
                  <div className="mt-2">
                    <FormInput name="nameTeam" label="Название команды" required />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                      htmlFor="country"
                      className="block text-sm/6 font-medium text-gray-900"
                  >
                    Страна
                  </label>
                  <div className="mt-2 grid grid-cols-1">
                    <FormField
                        control={form.control}
                        name="country"
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
                                  <SelectItem value="Россия">
                                    Россия
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-red-500 text-sm mt-1" />
                            </FormItem>
                        )}
                    />
                    { }
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                      htmlFor="region"
                      className="block text-sm/6 font-medium text-gray-900"
                  ></label>
                  <div className="mt-2">
                    <FormInput name="region" label="Регион" required />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                      htmlFor="city"
                      className="block text-sm/6 font-medium text-gray-900"
                  ></label>
                  <div className="mt-2">
                    <FormInput
                        name="city"
                        label="Город"
                        required
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                      htmlFor="vkUrl"
                      className="block text-sm/6 font-medium text-gray-900"
                  ></label>
                  <div className="mt-2">
                    <FormInput
                        name="vkUrl"
                        label="Ссылка на профиль в 'Вконтакте'"
                        type='text'
                        required
                    />
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
                        label="Учебное заведение/организация, которую представляет ваша команда"
                        required
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                      htmlFor="phone"
                      className="block text-sm/6 font-medium text-gray-900"
                  ></label>
                  <div className="mt-2">
                    <FormInput
                        name="phone"
                        label="Мобильный номер телефона"
                        type='tel'
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
                      name="email"
                      label="Адрес электронной почты"
                      required
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="password"
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
                    htmlFor="startTest"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Категория
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
                              <SelectItem value="START">
                                Входной
                              </SelectItem>
                              <SelectItem value="RESULT">
                                Итоговый
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-500 text-sm mt-1" />
                        </FormItem>
                      )}
                    />
                    { }
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <FormField
                      control={form.control}
                      name="agreement"
                      render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                            <FormControl>
                              <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  required
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Согласие на обработку и передачу персональных данных
                              </FormLabel>
                              <FormDescription>
                                Я даю свое согласие на обработку моих персональных данных и принимаю  <Link className='font-bold underline ' href="/agreement">согласие на обработку персональных данных</Link> {" "}

                              </FormDescription>
                            </div>
                          </FormItem>
                      )}
                  />
                </div>
                <div className="sm:col-span-3">
                  <FormField
                      control={form.control}
                      name="agreementVideo"
                      render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                            <FormControl>
                              <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  required
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Согласие на фото и видеосъемку
                              </FormLabel>
                              <FormDescription>
                                Я даю свое согласие на на фото и видеосъемку, а также на размещение их на ресурсах АНО АСИ и партнеров {" "}

                              </FormDescription>
                            </div>
                          </FormItem>
                      )}
                  />
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
