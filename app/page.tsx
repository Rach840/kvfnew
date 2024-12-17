
import { getUserSession } from "@/lib/get-session-server";
import Link from "next/link";
// import Header from "./components/shared/header";
export default async function Home() {
  const user = await getUserSession();
  return (
    <div style={{ top: '-38px' }} className=" relative overflow-y-hidden">
      <main
        style={{ backgroundColor: "#FFF5CC", height: "100vh" }}
        className="  text-zinc-950"
      >
        <div className=" relative ">

          <div className="mx-auto w-8/12  flex py-32  justify-between items-center  ">
            <div className="text-center w-2/4 ">
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
                    <a
                      href="/register"
                      className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Зарегистрироваться
                    </a>
                    <a
                      href="/login"
                      className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Войти
                    </a>
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
