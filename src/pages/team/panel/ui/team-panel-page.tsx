"use client";
import { TeamDashboard } from "./team-panel";
import {useRouter} from "next/navigation";
import React, {useEffect} from "react";
import {useSession} from "next-auth/react";
import NonAuth from "@/src/shared/ui/non-auth";


export function TeamDashboardPage() {
    const router = useRouter();
    const { data: session } = useSession();
console.log(session?.user.teamMember)
    useEffect(() => {
        if (session?.user && !session?.user.teamMember) {
            router.replace("/register-team");
        }
    }, [session, router]);
    if (!session?.user){
        return <NonAuth variant='team'/>
    }
    return (
        <>

            <TeamDashboard admin={false} />

        </>
    );
}