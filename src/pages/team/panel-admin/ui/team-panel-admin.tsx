"use client";

import {useRouter} from "next/navigation";
import React, { useState} from "react";
import {useSession} from "next-auth/react";

import Link from "next/link";
import {getAllTeam} from "@/src/app/actions";



export function AllTeamPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true)
    const [teams, setTeams] = useState([])
    React.useEffect(() => {
        if(session?.user &&  !(session?.user?.role == 'ADMIN')){
            router.replace("/")
        }
        (async () => {
            try {
                const team = await getAllTeam();
                setTeams(team)
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        })();
    }, []);
    return (
        <>
            <div>
                <div className="mt-10 container mx-auto space-y-4">
                    {!loading ? (
                        teams.map((team) => (

                                <div key={team.id} className="flex items-center bg-slate-300 grow rounded-2xl p-5 items-center justify-between">
                                    <span className="text-2xl font-medium">Команда {team.name}</span>
                                    <Link
                                        href={'/team-panel-admin/' + team.id}
                                        className="duration-300 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Подробнее
                                    </Link>
                                </div>

                        ))
                    ) : ''}
                </div>
            </div>


        </>
    );
}