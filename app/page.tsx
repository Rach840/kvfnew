'use client'
import { getUserSession } from "@/src/shared/lib/get-session-server";
import Link from "next/link";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
export default function Home() {
  const [user, setUser] = useState()

  const router = useRouter();
  useEffect(() => {

    (async ()=> {
      const user = await getUserSession();
      console.log(!user?.teamMember)
      if (!user?.teamMember) {
        router.replace("/");
      }
      setUser(user)
    })()

  }, []);
  return (
    <div style={{ top: '-38px' }} className=" relative overflow-y-hidden">
      <main
        style={{ backgroundColor: "#FFF5CC", }}
        className=" h-screen text-zinc-950"
      >
        <div className=" relative flex items-center h-full ">

          <div className="mx-auto  w-8/12  flex py-10 lg:py-20 flex-col-reverse  xl:py-32 xl:flex-row   justify-between items-center  ">
            <div className="text-center w-full xl:w-2/4 ">
              <h1 className="text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
                Клуб веселых финансистов
              </h1>
              <p className="mt-8 text-pretty  text-lg font-medium text-black  sm:text-xl/8">
                Чтобы перейти к тестам, нужно зарегистрироваться или
                авторизоваться
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                {user ? (
                  <Link
                    href="/test"
                    className="text-lg font-semibold text-gray-900"
                  >
                    Пройти тест <span aria-hidden="true">→</span>
                  </Link>
                ) : (
                  <>
                    {" "}
                    <Link
                      href="/register"
                      className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Зарегистрироваться
                    </Link>
                    <Link
                      href="/login"
                      className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Войти
                    </Link>
                  </>
                )}
              </div>
            </div>
            <img src="./fullscreenImg.png" className="size-5/12" alt="" />
          </div>
        </div>
      </main>
    </div>
  );
}
