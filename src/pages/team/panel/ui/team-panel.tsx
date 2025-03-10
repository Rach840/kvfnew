"use client"

import React, { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/shared/ui/tabs"
import { TeamMembersList } from "@/src/shared/ui/team-members-list"


import {usePathname, useRouter} from "next/navigation";
import {getTeamMember} from "@/src/app/actions";
import {getUserSession} from "@/src/shared/lib/get-session-server";
import {Card, CardContent} from "@/src/shared/ui/card";
import {Users} from "lucide-react";
import Link from "next/link";
import Skeleton from "@mui/material/Skeleton";






export function TeamDashboard({admin} : {admin: boolean}) {
    const pathName = usePathname().replace("/team-panel-admin/", "");
    const router = useRouter();
    const [teamMembers, setTeamMembers] = useState([])
    const [loading, setLoading] = useState(true)
console.log(pathName)
    React.useEffect(() => {
        (async () => {
            try {
                if (admin){
                    console.log(pathName)
                    const members = await getTeamMember(pathName)
                    setTeamMembers(members)
                    setLoading(false);
                }else{
                    const session = await getUserSession();

                    if (session != null && session.teamMember != null) {
                        const members = await getTeamMember(session.teamMember);

                        setTeamMembers(members)

                    }
                    if (session?.teamMember == null){
                        router.replace("/register-team")
                    }

                    if (session && !session?.emailVerified) {
                        router.replace("/verification-request")
                        setLoading(false);
                    }
                }
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        })();
    }, [pathName]);

console.log(teamMembers);

if (!loading) {
    return (
        <div className='container mx-auto'>
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Страница команды {teamMembers.name}</h1>
                </div>

            </div>

            <div className="mb-12 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    <Card className='space-y-2 col-span-2'>
                        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-2">
                            <p className="text-lg font-medium">ФИО капитана: {teamMembers.captainFullName}</p>
                            <p className="text-lg font-medium">ФИО руководителя: {teamMembers.supervisorFullName}</p>
                            <p className="text-lg font-medium">Номер капитана: {teamMembers.captainPhone}</p>
                            <p className="text-lg font-medium">Номер руководителю: {teamMembers.supervisorPhone}</p>
                            <p className="text-lg font-medium">Почта капитана: {teamMembers.captainEmail}</p>
                            <p className="text-lg font-medium">Почта руководителю: {teamMembers.supervisorEmail}</p>
                            <p className="text-lg font-medium">Страна: {teamMembers.country}</p>
                            <p className="text-lg font-medium">Регион: {teamMembers.region}</p>
                            <p className="text-lg font-medium">Город: {teamMembers.city}</p>

                            <Link className='text-lg font-medium underline' href={`${teamMembers?.vkGroupUrl}`}>Ссылка на группу ВК</Link>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center space-x-2">
                                    <Users className="h-5 w-5 text-primary" />
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Количество участников</p>
                                        <p className="text-2xl text-center font-bold">{teamMembers?.members?.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <Tabs defaultValue="team" className="w-full">
                <TabsList className={admin ? "grid w-full grid-cols-2 mb-8" :"grid w-full grid-cols-1 mb-8"}>
                    <TabsTrigger value="team">Участники команды</TabsTrigger>

                </TabsList>
                <TabsContent value="team">
                    { !loading && <TeamMembersList teamMembers={teamMembers.members} />}
                </TabsContent>

            </Tabs>
        </div>
    )
} else {
    return (
        <div className='container mx-auto'>
            <Skeleton height={80} width={190} animation="wave" />
            <Skeleton height={100} style={{ marginBottom: -10 }} animation="wave" />
            <Skeleton height={100} style={{ marginBottom: -10 }} animation="wave" />
            <Skeleton height={100} style={{ marginBottom: -10 }} animation="wave" />
        </div>
    )
}


}
