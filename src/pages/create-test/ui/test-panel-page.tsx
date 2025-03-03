"use client";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Skeleton from '@mui/material/Skeleton';
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/src/shared/ui/button";
import { createTest, deleteTest, getTests, testBlocked, Tests, Users } from "@/src/app/actions";
import { FormControl, FormField } from "@/src/shared/ui/form";
import { getUserSession } from "@/src/shared/lib/get-session-server";
import Box from '@mui/material/Box';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/shared/ui/select";
import {
    CreateTestSchema,
    TCreateTestValues,
} from "@/src/shared/model/schema";
import { FormInput } from "@/components/shared/forms/forminput";
import Link from "next/link";
import { X } from "lucide-react";
import NotFound from "@/src/app/not-found";






export function CreateTestForm() {

    const [user, setUser] = useState<Users>();
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        (async () => {
            const u = await getUserSession();
            if (u) {
                setUser(u);
            } else {
                setUser(undefined); // Explicitly set undefined if the session is null or undefined
            }
        })();
    }, []);

    const form = useForm<TCreateTestValues>({
        resolver: zodResolver(CreateTestSchema),
        defaultValues: {
            category: "",
            name: "",
            nameTranslit: "",
            text: "",
        },
    });

    const [tests, setTests] = React.useState<Tests[] | undefined>([]);

    React.useEffect(() => {
        (async () => {
            const testArr = await getTests();
            if (testArr) {
                setTests(testArr);
            }

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
    if (!user || user.role != "ADMIN") {
        return (
            <NotFound />
        );
    } else if (isLoading) {
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
                                <Link
                                    href={`/create-test/statistic/${test.id}`}
                                    key={'stat' + test.id}
                                    className="flex duration-300 mx-10 rounded-md bg-zinc-800 px-5 py-3 text-sm my-4 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 items-center justify-between"
                                >Посмотреть статистику</Link>
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
