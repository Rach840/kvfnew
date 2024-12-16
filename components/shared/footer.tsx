import { Disclosure } from "@headlessui/react";


export default function Footer() {
	return (
		<>
			<Disclosure as="footer" className=" relative  mx-auto flexh-full ring-black/5   shadow ring-1  bg-white">
				<div className="mx-auto max-w-7xl px-4 p-3 sm:px-6 lg:px-8">
					<div className="flex h-24 items-center justify-between">
						<div className="flex justify-between w-full items-center">
							<div className="flex items-center">
								<div className="shrink-0 mr-4">
									<img
										onClick={() => router.replace("/")}
										alt="КВФ"
										src=".././logo.png"
										className="size-20 w-32"
									/>
								</div>
								<h2 className="text-balance text-lg  font-semibold tracking-tight text-gray-900 sm:text-lg">Клуб веселых финансистов</h2>
							</div>

							<div className="flex items-center">
								<a className="mr-4" href="https://telegram.org"  >
									<img
										alt=""
										src=".././Telegram_Logo.svg"
										className="inline-block hover:scale-125 duration-150 size-10 mr-5 rounded-full ring-2 ring-white"
									/>
								</a>
								<a className="mr-4" href="https://www.whatsapp.com/?lang=ru_RU" >
									<img
										alt=""
										src=".././whatsapp.png"
										className="inline-block hover:scale-125 duration-150 size-10 mr-5 rounded-full ring-2 ring-white"
									/>

								</a>
								<a className="mr-4" href="https://www.whatsapp.com/?lang=ru_RU" >
									<img
										alt=""
										src=".././VK_Logo.svg"
										className="inline-block hover:scale-125 duration-150 size-10 mr-5 rounded-full ring-2 ring-white"
									/>
								</a>
								<a className="mr-4" href="https://www.tiktok.com/" >
									<img
										alt=""
										src=".././tiktok.png"
										className="inline-block hover:scale-125 duration-150 size-10 mr-5 rounded-full ring-2 ring-white"
									/>
								</a>
							</div>
							<div className="block">
								<ul>
									<li className=" marker:text-black list-disc pl-1">Адрес: 127644, г. Москва, ул. Лобненская, д. 21, помещ. IV, к. 3</li>
									<li className="marker:text-black list-disc pl-1">Эл. почта: ano.asi.nko@yandex.ru</li>
									<li className="marker:text-black list-disc pl-1"> +7(932)248-53-09</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</Disclosure >
		</>
	)
}