import React, { useState} from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerTeam } from "@/src/app/actions";
import {
    TFormRegisterTeamValues,
    RegisterTeamSchema
} from "../../../../shared/model/schema";
import { Checkbox } from "@/src/shared/ui/checkbox"
import { FormInput } from "../../../../../components/shared/forms/forminput";
import { Button } from "@/src/shared/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/shared/ui/select";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,

    FormLabel,

    FormMessage,
} from "@/src/shared/ui/form";
import {Alert} from "@mui/material";
import {VerificationPage} from "@/src/pages/verification-request";


export const RegisterTeamForm: React.FC = ({ }) => {
    const [error, setError] = useState<string>()
    const [succes, setSucces] = useState<boolean>()
    const { data: session } = useSession();

    const form = useForm<TFormRegisterTeamValues>({
        resolver: zodResolver(RegisterTeamSchema),
        defaultValues: {
            name: "",
            country: "",
            region: "",
            city: "",
            institution: "",
            supervisorPhone: "",
            captainPhone: "",
            supervisorEmail: "",
            captainEmail: "",
            captainFullName: '',
            supervisorFullName: '',
        },
    });

    const onSubmit = async (data: TFormRegisterTeamValues) => {
        console.log(data);
        try {
            const result = await registerTeam({
                name: data.name,
                country: data.country,
                region: data.region ? data.region : "",
                city: data.city,
                institution: data.institution,
                supervisorPhone: data.supervisorPhone,
                supervisorId: session.user?.id,
                captainPhone: data.captainPhone,
                captainFullName: data.captainFullName,
                supervisorFullName: data.supervisorFullName,
                supervisorEmail: data.supervisorEmail,
                captainEmail: data.captainEmail,
                vkGroupUrl: data.vkGroupUrl
            },session.user?.id);


            if (result.message){
                setError(result.message)
            }
            if (result.success){
                setSucces(result.success)
            }
            console.log(result)

        } catch (err) {
            console.log(err);
        }
    };
if (succes){
    return <VerificationPage variant='registrTeam' />
}else {
    return (
        <FormProvider {...form}>
            <form
                className="flex border-x-2 container mx-auto px-10 bg-white border-y-2 rounded-lg   border-gray-900/10 pb-12 flex-col "
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <div className=" container   mx-auto">
                    <div className=" my-4 py-10 ">
                        <h2 className=" text-3xl font-semibold text-gray-900">
                            Заявка на регистрацию команды
                        </h2>
                        <p className="mt-1 text-sm/6 text-gray-600">
                            Зарегистрируете команду и набирайте участников!
                        </p>
                        {error && <Alert severity="error">{error}</Alert>}
                        <div className="mt-10 w-full  grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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
                                    htmlFor="vkGroupUrl"
                                    className="block text-sm/6 font-medium text-gray-900"
                                ></label>
                                <div className="mt-2">
                                    <FormInput
                                        name="vkGroupUrl"
                                        label="Ссылка на  группу команды 'Вконтакте'"
                                        type='text'
                                        required
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label
                                    htmlFor="institution"
                                    className="block text-sm/6 font-medium text-gray-900"
                                ></label>
                                <div className="mt-2">
                                    <FormInput
                                        name="institution"
                                        label="Учебное заведение/организация, которую представляет ваша команда"
                                        required
                                    />
                                </div>
                            </div>


                            <div className="sm:col-span-3">
                                <label
                                    htmlFor="supervisorFullName"
                                    className="block text-sm/6 font-medium text-gray-900"
                                ></label>
                                <div className="mt-2">
                                    <FormInput
                                        name="supervisorFullName"
                                        label="ФИО руководителя"
                                        type='text'
                                        required
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label
                                    htmlFor="supervisorPhone"
                                    className="block text-sm/6 font-medium text-gray-900"
                                ></label>
                                <div className="mt-2">
                                    <FormInput
                                        name="supervisorPhone"
                                        label="Мобильный номер телефона руководителя"
                                        type='tel'
                                        required
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label
                                    htmlFor="captainFullName"
                                    className="block text-sm/6 font-medium text-gray-900"
                                ></label>
                                <div className="mt-2">
                                    <FormInput
                                        name="captainFullName"
                                        label="ФИО капитана"
                                        type='text'
                                        required
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label
                                    htmlFor="captainPhone"
                                    className="block text-sm/6 font-medium text-gray-900"
                                ></label>
                                <div className="mt-2">
                                    <FormInput
                                        name="captainPhone"
                                        label="Мобильный номер телефона капитана"
                                        type='tel'
                                        required
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label
                                    htmlFor="supervisorEmail"
                                    className="block text-sm/6 font-medium text-gray-900"
                                ></label>
                                <div className="mt-2">
                                    <FormInput
                                        name="supervisorEmail"
                                        label="Электронная почта руководителя"
                                        type='email'
                                        required
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label
                                    htmlFor="captainEmail"
                                    className="block text-sm/6 font-medium text-gray-900"
                                ></label>
                                <div className="mt-2">
                                    <FormInput
                                        name="captainEmail"
                                        label="Электронная почта капитана"
                                        type='email'
                                        required
                                    />
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
                                Зарегистрировать команду
                            </Button>
                        </div>


                    </div>
                </div>
            </form>
        </FormProvider>
    );
}

};
