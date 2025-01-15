"use client";
import { getUserSession } from "@/lib/get-session-server";
import React, { useState } from "react";
import { getTests, Tests, Users } from "../actions";
import Link from "next/link";
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import NonAuth from "@/components/shared/non-auth";
import { useRouter } from "next/navigation";
export default function Test() {
  const [user, setUser] = useState<Users>();
  const [isLoading, setIsLoading] = React.useState(true);
  const [userTestsName, setUserTestsName] = React.useState();
  const router = useRouter();
  React.useEffect(() => {
    (async () => {
      const user = await getUserSession();
      if (user && !user?.emailVerified) {
        router.replace("/verification-request")
      }
      if (user != null) {
        setUser(user);
      }

      setIsLoading(true)
      if (user) {

        fetchTestName(user.role, user.startTest);



      } else {
        setIsLoading(false)

        return null;
      }

      const userTestResponce = await JSON.parse(user.testsResult);
      if (userTestResponce.length >= 1) {
        const userTestName = await userTestResponce.map((elem) => elem.testName);
        setUserTestsName(userTestName);
      }
    })();
  }, []);
  console.log(userTestsName)
  console.log(isLoading)
  const [testNoCatName, setTestNoCatName] = React.useState([]);
  const [testCatName, setTestCatName] = React.useState<Tests[] | undefined>([]);


  const fetchTestName = async (role: string, startTest: string) => {
    try {

      const testDetails = await getTests();


      if (testDetails != undefined && testDetails.length > 0) {
        const getTestName = testDetails.filter((elem) => elem.category == role);


        switch (startTest) {
          case 'TRAINING':
            setTestCatName(testDetails.find((elem) => elem.nameTranslit == 'trenirovochnyy-test'));
            break;
          case 'QUALIFYING':
            setTestCatName(testDetails.find((elem) => elem.nameTranslit == 'otborochnyy-test'));
            break;
          case 'BASIC':
            setTestCatName(testDetails.find((elem) => elem.nameTranslit == 'osnovnoy-test'));
            break;
          default:
            break;
        }

        setTestNoCatName(getTestName);

      } else {
        console.log("No tests found for the specified role");
      }
    } catch (error) {
      console.error("Error fetching test name:", error);
    }
    finally {
      setIsLoading(false);
    }
  };
  console.log(testNoCatName)
  console.log(testNoCatName.map((elem) => userTestsName?.includes(elem.name)))
  // let [keyDis, setKeyDis] = React.useState(1);
  let keyDis = 0;
  if (user) {
    return (

      <div className="container mx-auto py-10">
        <div className="relative w-11/12 lg:w-7/12  bg-white container mx-auto flex h-full ring-black/5 max-lg:rounded-t-[2rem] -top-10 py-5  shadow ring-1 flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
          <div className="px-8 pt-3 sm:px-3 sm:pt-3">
            <h4 className="mt-2 text-2xl text-center font-medium tracking-tight text-gray-950 max-lg:text-center">
              Перед началом прохождения тестов ознакомьтесь с инструкциями
            </h4>
          </div>
          <div className="flex flex-1 justify-center mt-10 px-7 max-lg:pb-12 max-lg:pt-7 sm:px-7 lg:pb-7">
            <ol>
              <li className="  text-xl my-1 list-decimal pl-1">Тестирование проходится один раз</li>
              <li className="  text-xl my-1 list-decimal pl-1">Ответы на все вопросы обязательны</li>
              <li className="  text-xl my-1 list-decimal pl-1">После прохождения теста тест блокируется</li>
              <li className="  text-xl my-1 list-decimal pl-1">Результаты тестирования вы увидете после прохождение, а также в личном кобинкте</li>
              <li className="  text-xl my-1 list-decimal pl-1">Повторное тестирование возможна после обращения к администратору площадки</li>

            </ol>
          </div>
        </div>
        <h3 className="text-balance text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          Ваши тесты
        </h3>
        {user.testPassed && testCatName.nameTranslit != 'trenirovochnyy-test' ? (
          <div key={keyDis++} className="opacity-75 items-center justify-between bg-white rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-t-[2rem] my-3 flex py-5 px-5 text-xl">
            {testCatName.name}

            <Link
              style={{ pointerEvents: "none" }}
              className="  duration-300 mr-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
              href={`/test/${testCatName.nameTranslit}`}
            >
              Пройти тест
            </Link>
          </div>
        ) : (
          <div key={keyDis++} className=" items-center justify-between bg-white rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-t-[2rem] my-3 flex py-5 px-5 text-xl">
            {testCatName.name}
            <Link
              className="  duration-300 mr-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
              href={`/test/${testCatName.nameTranslit}`}
            >
              Пройти тест
            </Link>
          </div>
        )
        }
        {
          testNoCatName.map((elem) =>
            elem.testDisable || user.testPassed == false || userTestsName?.includes(elem.name) ? (
              <div key={keyDis++} className="opacity-75 justify-between bg-white rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-t-[2rem] my-3 flex py-5 px-5 text-xl">
                {elem.name}

                <Link

                  style={{ pointerEvents: "none" }}
                  className="  duration-300 mr-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
                  href={`/test/${elem.nameTranslit}`}
                >
                  Пройти тест
                </Link>
              </div>
            ) : (

              <div key={keyDis++} className=" justify-between bg-white rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-t-[2rem] my-3 flex py-5 px-5 text-xl">
                {elem.name}

                <Link
                  className="  duration-300 mr-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
                  href={`/test/${elem.nameTranslit}`}
                >
                  Пройти тест
                </Link>
              </div>
            )
          )
        }
      </div >
    );
  } else if (isLoading) {
    return (
      <Box sx={{ margin: '20px auto', width: "80%" }}>
        <div className="relative bg-white w-11/12 lg:w-7/12 container mx-auto flex h-full ring-black/5 max-lg:rounded-t-[2rem] -top-10 py-5  shadow ring-1 flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
          <div className="px-8 pt-3 sm:px-3 sm:pt-3">
            <h4 className="mt-2 text-2xl text-center font-medium tracking-tight text-gray-950 max-lg:text-center">
              Перед началом прохождения тестов ознакомьтесь с инструкциями
            </h4>
          </div>
          <div className="flex flex-1 justify-center mt-10 px-7 max-lg:pb-12 max-lg:pt-7 sm:px-7 lg:pb-7">
            <ol>
              <li className="  text-xl my-1 list-decimal pl-1">Тестирование проходится один раз</li>
              <li className="  text-xl my-1 list-decimal pl-1">Ответы на все вопросы обязательны</li>
              <li className="  text-xl my-1 list-decimal pl-1">После прохождения теста тест блокируется</li>
              <li className="  text-xl my-1 list-decimal pl-1">Результаты тестирования вы увидете после прохождение, а также в личном кобинкте</li>
              <li className="  text-xl my-1 list-decimal pl-1">Повторное тестирование возможна после обращения к администратору площадки</li>

            </ol>
          </div>
        </div>
        <Skeleton height={80} width={190} animation="wave" />
        <Skeleton height={100} style={{ marginBottom: -10 }} animation="wave" />
        <Skeleton height={100} style={{ marginBottom: -10 }} animation="wave" />
        <Skeleton height={100} style={{ marginBottom: -10 }} animation="wave" />

      </Box>
    )

  } else {
    return (
      <NonAuth />
    );
  }
}
