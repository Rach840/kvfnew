import React, { useState} from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JoinTeamSchema, TFormJoinValues
} from "../../../../shared/model/schema";

import { FormInput } from "../../../../../components/shared/forms/forminput";
import { Button } from "@/src/shared/ui/button";
import { useSession } from "next-auth/react";
import {Alert} from "@mui/material";
import { joinTeam } from "@/src/app/actions";
import {VerificationPage} from "@/src/pages/verification-request";


export const JoinTeamForm: React.FC = ({ }) => {
    const [error, setError] = useState<string>()
    const [succes, setSucces] = useState<boolean>()
    const { data: session } = useSession();

    const form = useForm<TFormJoinValues>({
        resolver: zodResolver(JoinTeamSchema),
        defaultValues: {
            key: ''
        },
    });

    const onSubmit = async (data: TFormJoinValues) => {
        const result = await joinTeam(data ,session.user);

        try {
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
    return <VerificationPage variant='join' />
}else {
    return (
        <FormProvider {...form}>
            <form
                className="flex border-x-2 container mx-auto px-10  w-3/6  bg-white border-y-2 rounded-lg   border-gray-900/10 pb-12 flex-col "
                onSubmit={form.handleSubmit(onSubmit)}
            >



                <div className=" container   mx-auto">
                    <div className=" my-4 py-10 ">
                        <h2 className=" text-3xl font-semibold text-gray-900">
                            Заявка на вступление в команду
                        </h2>
                        <p className="mt-1 text-sm/6 text-gray-600">
                            Вступите в команду и участвуйте в игре!
                        </p>

                        <div className="mt-10  space-y-4 ">
                            {error && <Alert severity="error">{error}</Alert>}

                            <div className="sm:col-span-3">
                                <label
                                    htmlFor="key"
                                    className="block text-sm/6 font-medium text-gray-900"
                                ></label>
                                <div className="mt-2">
                                    <FormInput name="key" onChange={()=> setError('')} label="Ключ приглашения команды" required />
                                </div>
                            </div>


                            <Button
                                loading={form.formState.isSubmitting}
                                variant={"secondary"}
                                className="duration-300 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                type="submit"
                            >
                                Вступить в команду
                            </Button>
                        </div>


                    </div>
                </div>
            </form>
        </FormProvider>
    );
}


};
