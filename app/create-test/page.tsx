"use client";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Skeleton from '@mui/material/Skeleton';
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { createTest, deleteTest, getTests, testBlocked } from "@/app/actions";
import { FormControl, FormField } from "@/components/ui/form";
import { getUserSession } from "@/lib/get-session-server";
import Box from '@mui/material/Box';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreateTestSchema,
  TCreateTestValues,
} from "@/components/shared/forms/schema";
import { FormInput } from "@/components/shared/forms/forminput";
import Link from "next/link";
import { X } from "lucide-react";





export default function CreateTestForm() {

  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      const u = await getUserSession();
      setUser(u);
    })();
  }, []);

  const form = useForm<TCreateTestValues>({
    resolver: zodResolver(CreateTestSchema),
    defaultValues: {
      category: "",
      name: "",
      text: "",
    },
  });

  const [tests, setTests] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      const testArr = await getTests();
      setTests(testArr);
      setIsLoading(false);
    })();
  }, []);

  const testBlockedRedirect = async (id: number) => {
    testBlocked(id);
    const testArr = await getTests();
    setTests(testArr);
  };
  const onSubmit = async (data: TCreateTestValues) => {
    try {
      await createTest(data).then(async () => {
        const testArr = await getTests();
        setTests(testArr);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const testDelete = async (id: number) => {
    deleteTest(id);
    const testArr = await getTests();
    setTests(testArr);
  };

  if (isLoading) {
    return (
      <Box sx={{ margin: '20px auto', width: "80%" }}>

        <Skeleton height={80} width={190} animation="wave" />
        <Skeleton height={30} style={{ marginBottom: -15 }} animation="wave" />
        <Skeleton height={100} style={{ marginBottom: 5 }} animation="wave" />
        <Skeleton height={30} style={{ marginBottom: -15 }} animation="wave" />
        <Skeleton height={100} style={{ marginBottom: -20 }} animation="wave" />
        <Skeleton height={70} width={100} style={{ marginBottom: 15 }} animation="wave" />

        <Skeleton height={140} style={{ marginBottom: -40 }} animation="wave" />
        <Skeleton height={140} style={{ marginBottom: -40 }} animation="wave" />
        <Skeleton height={140} style={{ marginBottom: -40 }} animation="wave" />

      </Box>
    );
  } else if (!user || user.role != "ADMIN") {
    return (
      <div className="relative container mx-auto flex h-full ring-black/5 max-lg:rounded-t-[2rem] my-6 py-10 shadow ring-1 flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
        <div className="px-8 pt-8 sm:px-10 sm:pt-10">
          <h4 className="mt-2 text-4xl text-center font-medium tracking-tight text-gray-950 max-lg:text-center">
            Ошибка, данной страницы не существует
          </h4>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <FormProvider {...form}>
          <form
            className=" container py-5 mx-auto"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <h3 className="text-balance text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              Создание тестов
            </h3>
            <div className="mt-10 ">
              <div className="mx-auto">
                <label
                  htmlFor="first-name"
                  className="block text-sm/6 font-medium text-gray-900"
                ></label>
                <FormInput name="name" label="Название теста" required />

                <p className="mt-8 text-pretty text-lg font-medium sm:text-xl/8">
                  Выберите категорию теста
                </p>
                <FormField
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="STUDENT">Студент</SelectItem>
                        <SelectItem value="SCHOOLBOY">Школьник</SelectItem>
                        <SelectItem value="SPECIALIST">Специалист</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  name="category"
                ></FormField>
                <Button
                  loading={form.formState.isSubmitting}
                  variant={"default"}
                  type="submit"
                  className="mt-4"
                >
                  Создать
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
        <div>
          <div className="mt-10 container mx-auto space-y-4">
            {tests.map((test) => (
              <div key={test.id} className="flex items-center bg-slate-300 grow rounded-2xl p-5 items-center justify-between">
                <Link
                  href={`/create-test/${test.id}`}
                  key={test.id}
                  className="flex bg-slate-300 grow rounded-2xl p-5 items-center justify-between"
                >
                  <span className="text-lg font-medium">{test.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {test.category}
                  </span>
                </Link>
                <Button
                  onClick={() => testBlockedRedirect(test.id)}
                  variant={test.testDisable ? 'succes' : "destructive"}
                  className="mr-4"
                >
                  {test.testDisable ? ('Разблокировать') : ('Заблокировать')}

                </Button>


                <Button
                  onClick={() => testDelete(test.id)}
                  variant={"destructive"}
                  className=""
                >
                  <X />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

}
