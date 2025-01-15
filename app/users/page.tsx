
"use client";

import React from "react";
import { getAllUsers, Users } from "../actions";
import { getUserSession } from "@/lib/get-session-server";
import ExportButton from "@/components/shared/export-button";
import NotFound from "../not-found";

export default function UsersDashboard() {
  const [users, setUsers] = React.useState<Users[]>([]);
  const [_users, _setUsers] = React.useState<Users[]>([]);
  const [emptyUser, setEmptyUser] = React.useState<boolean>(false);

  const [session, setSession] = React.useState<Users | null>(null);

  React.useEffect(() => {
    async function fetchData() {
      const usersData = await getAllUsers();
      const usersTime = await getAllUsers();

      const sessionData = await getUserSession();

      usersData.sort((userA, userB) => userB.okAnswers - userA.okAnswers);
      usersData.map(
        (item) =>
        (item.passedDate = item.passedDate
          ? new Date(Number(item.passedDate)).toLocaleString()
          : "-")
      );
      usersTime.map(
        (item) =>
          (item.passedDate = new Date(Number(item.passedDate)).toLocaleString())
      );

      _setUsers(usersTime);

      setUsers(usersData);
      if (sessionData) {
        setSession(sessionData);
      } else {
        setSession(null);
      }

    }

    fetchData();
  }, []);

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
  console.log(users);
  console.log(_users);
  const handleRowClick = () => {
    setEmptyUser(false);
    const fromElement = document.querySelector("#from") as HTMLInputElement | null;
    const toElement = document.querySelector("#to") as HTMLInputElement | null;
    const from = fromElement?.value || ""; // Provide a default empty string
    const to = toElement?.value || "";
    const filteredUsers = _users.filter((user) => {
      const startDate = from ? new Date(from).getTime() : NaN;
      const endDate = to ? new Date(to).getTime() : NaN;

      const passedDate = convertToTimestamp(user.passedDate);
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

  return session && session.role === "ADMIN" ? (
    <div className="w-12/12 mx-auto mt-3 ">
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

            <select
              defaultValue="TRAINING"
              id="categorysTest"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="TRAINING">Тренировочный</option>
              <option value="QUALIFYING">Отборочный</option>
              <option value="BASIC">Основной</option>
            </select>
          </div>
          <button
            onClick={categorysTest}
            type="button"
            className="mx-3 mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          >
            Найти
          </button>

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
                  {user.role == "SCHOOLBOY"
                    ? "Школьники"
                    : user.role == "STUDENT"
                      ? "Студенты"
                      : "Специалисты"}
                </td>
                <td className="px-4 py-2">
                  {user.startTest == "TRAINING"
                    ? "Тренировочный"
                    : user.startTest == "QUALIFYING"
                      ? "Отборочный"
                      : "Основной"}
                </td>

                <td>{user.okAnswers}</td>
                <td className="px-4 py-2">{user.testPassed ? "✅" : "❌"}</td>
                <td className="px-4 py-2">
                  {user.passedDate ? user.passedDate.toLocaleString() : "-"}
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
  ) : (
    <NotFound />
  );
}
