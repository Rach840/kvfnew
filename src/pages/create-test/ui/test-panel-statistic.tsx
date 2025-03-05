'use client';

import { getAllUsers, getTest, Tests, Users } from "@/src/app/actions";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { getUserSession } from "@/src/shared/lib/get-session-server";
import ExportButton from "@/src/shared/ui/export-button";
import { pieArcLabelClasses, PieChart } from '@mui/x-charts/PieChart';
import { UsersUnPackage } from "@/src/shared/model/types";

export function Statistic() {
    const [users, setUsers] = React.useState<UsersUnPackage[]>([]);
    const [_users, _setUsers] = React.useState<UsersUnPackage[]>([]);
    const [usersTests, setUsersTests] = useState<Users[]>();
    // const [usersPassedTests, setUsersPassedTests] = useState<boolean>();
    // const [user, setUser] = useState();
    // const [isLoading, setIsLoading] = React.useState(true);
    const pathId = Number(usePathname().replace("/create-test/statistic/", ""));
    const [emptyUser, setEmptyUser] = React.useState<boolean>(false);

    React.useEffect(() => {
        (async () => {
            try {
                const user = await getUserSession();
                const testById: Tests | null = await getTest(pathId);
                const userAll: Users[] = await getAllUsers();

                if (user?.role === 'ADMIN') {
                    const userPassedTests = userAll.filter(item =>
                        JSON.parse(item.testsResult as string).find((item: { testName: string; }) => item.testName === testById?.name)
                    );

                    const usersResultTest = userPassedTests.map(item => {
                        const itemParse = JSON.parse(item.testsResult as string).find((item: { testName: string; }) => item.testName === testById?.name);
                        itemParse.passedDate = new Date(Number(itemParse.passedDate)).toLocaleString();
                        return {
                            ...item,
                            testsResult: itemParse,
                        };
                    });

                    usersResultTest.sort((userA, userB) => userB.testsResult.score - userA.testsResult.score);

                    // Update state only once after processing
                    _setUsers(usersResultTest);
                    setUsers(usersResultTest);
                    // setUsersPassedTests(usersResultTest);
                    setUsersTests(userPassedTests);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        })();
    }, [pathId]);
    function convertToTimestamp(dateString: string) {
        console.log(dateString)
        const [datePart, timePart] = dateString.split(", ");

        const [day, month, year] = datePart.split(".").map(Number);

        // Split the time into hours, minutes, and seconds
        const [hours, minutes, seconds] = timePart.split(":").map(Number);

        // Create a new Date object using the parsed values
        const date = new Date(year, month - 1, day, hours, minutes, seconds);

        // Return the timestamp
        return date.getTime();
    }
    const handleRowClick = () => {
        setEmptyUser(false);
        const fromElement = document.querySelector("#from") as HTMLInputElement | null;
        const toElement = document.querySelector("#to") as HTMLInputElement | null;
        const from = fromElement?.value || ""; // Provide a default empty string
        const to = toElement?.value || "";
        const filteredUsers = _users.filter((user) => {
            const startDate = new Date(from).getTime();
            const endDate = new Date(to).getTime();


            const passedDate = convertToTimestamp(user.testsResult.passedDate);
            if (isNaN(endDate)) {
                return passedDate >= startDate;
            } else if (isNaN(startDate)) {
                return passedDate <= endDate;
            } else {
                return passedDate >= startDate && passedDate <= endDate;
            }
        });
        if (filteredUsers.length == 0) {
            setEmptyUser(true);
        }
        _setUsers(_users);
        setUsers(filteredUsers);
    };

    function searchUsers() {
        setEmptyUser(false);
        const searchElement = document.querySelector("#search") as HTMLInputElement | null;
        const searchValue = searchElement?.value || '';
        const searched = users.filter(
            (item) =>
                item.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
                item.organisation.toLowerCase().includes(searchValue.toLowerCase())
        );
        if (searched.length == 0) {
            setEmptyUser(true);
        }
        _setUsers(_users);
        return setUsers(searched);
    }
    function filltrScore() {
        setEmptyUser(false);
        const fromElement = document.querySelector("#fromScore") as HTMLInputElement | null;
        const toElement = document.querySelector("#toScore") as HTMLInputElement | null;
        const from = Number(fromElement?.value) || 0;
        const to = Number(toElement?.value) || 300;

        const filteredUsers = _users.filter((user) => {

            const passedDate = user.testsResult.score;
            if (isNaN(to as number) && to as number >= 0) {
                return passedDate >= from;
            } else if (isNaN(from as number) && from as number <= 100) {
                return passedDate <= to;
            } else {
                return passedDate >= from && passedDate <= to;
            }
        });
        if (filteredUsers.length == 0) {
            setEmptyUser(true);
        }
        _setUsers(_users);
        setUsers(filteredUsers);

    }
    function categorysTest() {
        setEmptyUser(false);
        const categoryElement = document.querySelector("#categorysTest") as HTMLInputElement | null;
        const categoryValue = categoryElement?.value;
        const searched = _users.filter((item) => item.startTest == categoryValue);
        if (searched.length == 0) {
            setEmptyUser(true);
        }
        _setUsers(_users);
        return setUsers(searched);
    }
    function resetFilters() {
        setEmptyUser(false);
        const fromElement = document.querySelector("#from") as HTMLInputElement;
        const toElement = document.querySelector("#to") as HTMLInputElement;
        fromElement.value = ''; // Provide a default empty string
        toElement.value = "";
        const searchElement = document.querySelector("#search") as HTMLInputElement;
        searchElement.value = '';
        return setUsers(_users);
    }
    const stat1 = users.filter(item => item.testsResult.score > 0 && item.testsResult.score < 20).length
    const stat2 = users.filter(item => item.testsResult.score >= 20 && item.testsResult.score < 40).length
    const stat3 = users.filter(item => item.testsResult.score >= 40 && item.testsResult.score < 60).length
    const stat4 = users.filter(item => item.testsResult.score >= 60 && item.testsResult.score < 80).length
    const stat5 = users.filter(item => item.testsResult.score >= 80 && item.testsResult.score <= 100).length
    const stats = [
        { value: stat1, label: 'От 0 до 20' },
        { value: stat2, label: 'От 20 до 40' },
        { value: stat3, label: 'От 40 до 60' },
        { value: stat4, label: 'От 60 до 80' },
        { value: stat5, label: 'От 80 до 100' },
    ]
    const valueFormatter = (item: { value: number }) => `${(item.value / users.length * 100).toFixed(2)}%`;
    const data = {
        data: stats,
        valueFormatter,
    };
    const size = {
        width: 500,
        height: 300,
    };
    console.log(users)
    console.log(usersTests && usersTests.length > 0)
    if (usersTests) {
        return (
            <div className="w-12/12 mx-auto mt-3 ">
                <PieChart
                    series={[
                        {
                            arcLabel: (item) => `${(item.value / users.length * 100).toFixed(2)}%`,
                            arcLabelMinAngle: 35,
                            arcLabelRadius: '60%',
                            ...data,
                        },
                    ]}
                    sx={{
                        [`& .${pieArcLabelClasses.root}`]: {
                            fontWeight: 'bold',
                        },
                    }}
                    {...size}
                    className="mx-auto  -top-9"
                />
                {/* <PieChart
					series={
						[{
							data: [
								{ id: 0, value: stat1, label: 'series A' },
								{ id: 1, value: stat2, label: 'series B' },
								{ id: 2, value: stat3, label: 'series C' },
								{ id: 3, value: stat4, label: 'series C' },
								{ id: 4, value: stat5, label: 'series C' },
							],
						},
						]}
					width={500}
					height={300}
					className="mx-auto  -top-9"
				/> */}

                <div className="flex items-center justify-between rounded-t-xl bg-gray-100 py-3 px-3  pt-4">
                    <div className="block">
                        <label
                            htmlFor="from"
                            className="mx-3  text-lg min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6 p-3"
                        >
                            {" "}
                            Отсортировать в диапазоне времени от:
                        </label>
                        <div className="flex items-end">
                            <input
                                type="date"
                                id="from"
                                className=" w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                            <label
                                htmlFor="from"
                                className="mx-3  min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6 p-3"
                            >
                                {" "}
                                До:
                            </label>

                            <input
                                type="date"
                                id="to"
                                className="mx-3  w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                            <button
                                onClick={handleRowClick}
                                type="button"
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            >
                                Отсортировать
                            </button>
                        </div>
                    </div>
                    <div className="block">
                        <label
                            htmlFor="from"
                            className="mx-3  text-lg min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6 p-3"
                        >
                            {" "}
                            Отсортировать в диапазоне баллов от:
                        </label>
                        <div className="flex items-end">
                            <input
                                type="number"
                                id="fromScore"
                                className=" w-16 p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                            <label
                                htmlFor="fromScore"
                                className="mx-1 min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6 p-3"
                            >
                                {" "}
                                До:
                            </label>

                            <input
                                type="number"
                                id="toScore"
                                className="mx-3  w-16 p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                            <button
                                onClick={filltrScore}
                                type="button"
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            >
                                Отсортировать
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={resetFilters}
                        type="button"
                        className="mx-3 mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    >
                        Очистить фильтры
                    </button>
                    <div className="flex  items-end ">
                        <div className="block">
                            <label
                                htmlFor="from"
                                className="mx-3  min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6 p-3"
                            >
                                {" "}
                                Выберите категорию начального теста
                            </label>
                            <div className="flex justify-center items-center">
                                <select
                                    defaultValue="TRAINING"
                                    id="categorysTest"
                                    className="bg-gray-50 border w-36 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                >
                                    <option value="TRAINING">Тренировочный</option>
                                    <option value="QUALIFYING">Отборочный</option>
                                    <option value="BASIC">Основной</option>
                                </select>
                                <button
                                    onClick={categorysTest}
                                    type="button"
                                    className="mx-3 mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                >
                                    Найти
                                </button>
                            </div>
                        </div>

                        <div className="block">
                            <label
                                htmlFor="from"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white "
                            >
                                {" "}
                                Найти пользователей по имени или организация:{" "}
                            </label>
                            <input
                                id="search"
                                type="text"
                                placeholder="Имя или название организации"
                                className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                        </div>

                        <button
                            onClick={searchUsers}
                            type="button"
                            className="mx-3 mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        >
                            Найти
                        </button>
                    </div>
                </div>
                {!emptyUser ? (
                    <table className="table-auto w-full">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2">Имя</th>
                            <th className="px-4 py-2">Фамилия</th>
                            <th className="px-4 py-2">Отчество</th>
                            <th className="px-4 py-2">Почта</th>
                            <th className="px-4 py-2">Организация</th>
                            <th className="px-4 py-2">Специализация</th>
                            <th className="px-4 py-2">Уровень начального теста</th>
                            <th className="px-4 py-2">Правильных ответов</th>
                            <th className="px-4 py-2">Тест пройден</th>
                            <th className="px-4 py-2">Когда пройден</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="bg-white border-b cursor-pointer">
                                <td className="px-4 py-2">{user.firstName}</td>
                                <td className="px-4 py-2">{user.lastName}</td>
                                <td className="px-4 py-2">{user.surName}</td>
                                <td className="px-4 py-2">{user.email}</td>
                                <td className="px-4 py-2">{user.organisation}</td>
                                <td className="px-4 py-2">
                                    {user.role == "USER"
                                        ? "Пользователь"
                                      
                                            : "Админ"}
                                </td>
                                <td className="px-4 py-2">
                                    {user.startTest == "START"
                                        ? "Начальный"
                                            : "Итоговый"}
                                </td>

                                <td>{user.testsResult.score}</td>
                                <td className="px-4 py-2">{user.testPassed ? "✅" : "❌"}</td>
                                <td className="px-4 py-2">
                                    {user.testsResult.passedDate ? user.testsResult.passedDate.toLocaleString() : "-"}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="relative bg-white container mx-auto flex h-full ring-black/5 max-lg:rounded-t-[2rem] my-6 py-20 shadow ring-1 flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
                        <h4 className="mt-2 text-4xl text-center font-medium tracking-tight text-gray-950 max-lg:text-center">
                            Пользователей с таким параметром нету
                        </h4>
                    </div>
                )}

                <div className="flex flex-1 justify-center mt-10 px-10 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-12">
                    {" "}
                    <ExportButton response={users} />
                </div>
            </div>
            // <div >
            // 	{usersTests.length > 0 ? (
            // 		usersTests?.map((elem, index) => (
            // 			<div
            // 				key={elem.firstName}
            // 				className="relative bg-white container px-4 mx-auto flex h-full ring-black/5 max-lg:rounded-t-[2rem] my-6 py-10  shadow ring-1 flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]"
            // 			>
            // 				<p className="text-lg">
            // 					Пользователь <strong>{elem.firstName}</strong> прошел
            // 					<strong>	{usersPassedTests[index].testName}</strong> на:{" "}
            // 					{usersPassedTests[index].score} баллов. пройден в{" "}
            // 					{new Date(Number(usersPassedTests[index].passedDate)).toLocaleString()}
            // 				</p>
            // 			</div>
            // 		))
            // 	) : (
            // 		<div className="relative bg-white px-4 text-3xl text-center  container mx-auto flex h-full ring-black/5 max-lg:rounded-t-[2rem]  my-6 py-10  shadow ring-1 flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]"> <h1>К сожелению никто еще не прошел тест</h1></div>
            // 	)
            // 	}
            // </div >
        )
    } else {
        return
    }



}