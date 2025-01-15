export default function NotFound() {
  return (
    <div className="relative bg-white  w-6/12 container mx-auto flex h-full ring-black/5 max-lg:rounded-t-[2rem] my-6 py-10 shadow ring-1 flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
      <div className="px-8 py-8 sm:px-10 sm:py-10">
        <h4 className="mt-2 text-4xl text-center font-medium tracking-tight text-gray-950 max-lg:text-center">
          Ошибка, данной страницы не существует
        </h4>
      </div>
    </div>
  );
}
