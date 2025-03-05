"use client";
import { RegisterTeamForm } from "./register-team-form";

import React, {useEffect, useState} from "react";
import {  useSession } from "next-auth/react";
import { useRouter} from "next/navigation";
import NonAuth from "@/src/shared/ui/non-auth";
import {JoinTeamForm} from "@/src/pages/team/register/ui/join-team";


export function RegisterTeamPage() {
    const router = useRouter();
    const [variant, setVariant] = useState("change");
    const { data: session } = useSession();
    console.log(session?.user)
    useEffect(() => {
        if (session?.user?.teamMember) {
            router.replace("/");
        }
    }, [session, router]);
if (!session?.user){
   return <NonAuth variant='team'/>
}
if (session?.user && variant == "change"){
    return (
        <div className="relative bg-white container mx-auto flex h-full ring-black/5 max-lg:rounded-t-[2rem] my-6 py-10  shadow ring-1 flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
            <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <h4 className="mt-2 text-4xl text-center font-medium tracking-tight text-gray-950 max-lg:text-center">
                    Выберите вступить в существующую команду или создать свою
                     </h4>
            </div>
            <div className="flex flex-1 justify-center mt-10 px-10 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-12">
                <button
                    onClick={() => setVariant("join")}
                    className="duration-300 mr-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Вступить в команду
                </button>
                <button
                   onClick={() => setVariant("register")}
                    className="duration-300 mr-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Создать команду
                </button>
            </div>
        </div>
    )
}
if (session?.user && variant == "register"){
    return (

            <div className="-mt-6 container mx-auto">
            <button
                onClick={() => setVariant("change")}
                className=" mb-3 duration-300 mr-4 rounded-md bg-indigo-600 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
                Назад
            </button>
            <RegisterTeamForm />
            </div>

    );
}
    if (session?.user && variant == "join"){
        return (
            <>
                <div className="-mt-6 container mx-auto">
                <button
                    onClick={() => setVariant("change")}
                    className="mb-3 duration-300 mr-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Назад
                </button>
                    <JoinTeamForm/>
                </div>

            </>
        );
    }

}