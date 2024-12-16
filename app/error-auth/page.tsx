export default function Error() {
  return (
    <div className="relative container mx-auto flex h-full ring-black/5 max-lg:rounded-t-[2rem] my-6 py-10  shadow ring-1 flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
      <div className="px-8 pt-8 sm:px-10 sm:pt-10">
        <h4 className="mt-2 text-4xl text-center font-medium tracking-tight text-gray-950 max-lg:text-center">
          Ошибка, такого пользователя нет
        </h4>
      </div>
      <div className="flex flex-1 justify-center mt-10 px-10 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-12">
        <a
          href="/login"
          className="duration-300 mr-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Войти
        </a>
        <a
          href="/register"
          className="duration-300 mr-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Зарегистрироваться
        </a>
      </div>
    </div>
  );
}
