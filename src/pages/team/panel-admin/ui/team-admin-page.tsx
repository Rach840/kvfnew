"use client";
import { TeamDashboard } from "@/src/pages/team/panel";
import {useRouter} from "next/navigation";
import React, {useEffect} from "react";
import {useSession} from "next-auth/react";


export function TeamAdminPage() {
    const router = useRouter();
    const { data: session } = useSession();
    console.log(session?.user.teamMember)
    useEffect(() => {
        if(session?.user &&  !(session?.user?.role == 'ADMIN')){
            router.replace("/")
        }
    }, [session, router]);

    return (
        <>

            <TeamDashboard admin={true} />

        </>
    );
}