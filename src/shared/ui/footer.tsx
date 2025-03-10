import { Disclosure } from "@headlessui/react";


export default function Footer() {
	return (
		<>
			<Disclosure as="footer" className=" relative h-fit  mx-auto flexh-full ring-black/5   shadow ring-1  bg-white">
				<div className="mx-auto max-w-7xl px-4 p-3 sm:px-6 lg:px-8">
					<div className="flex  items-center justify-between">
						<div className="flex flex-wrap justify-center lg:justify-between  w-full h-- items-center">
							<div className="flex my-4 lg:my-auto items-center">
								<div className="shrink-0 mr-4">
									<img
										onClick={() => router.replace("/")}
										alt="КВФ"
										src=".././logo.jpg"
										className="size-18 w-32"
									/>
								</div>
								<h2 style={{color:' #8d7750'}}  className="text-balance  text-lg  font-semibold tracking-tight text-gray-900 sm:text-lg">Агентство социальных инициатив</h2>
							</div>

							<div className="flex space-x-2 my-4 lg:my-auto items-center">
								<a className="" href="https://t.me/+NGxD5-3vkYwyYmQy"  >
									<img
										alt=""
										src=".././Telegram_Logo.svg"
										className="inline-block hover:scale-125 duration-150 size-10 mr-5 rounded-full ring-2 ring-white"
									/>
								</a>
								<a className="" href="https://chat.whatsapp.com/FW0rsjSkQquKba8I88fmTp" >
									<img
										alt=""
										src=".././whatsapp.png"
										className="inline-block hover:scale-125 duration-150 size-10 mr-5 rounded-full ring-2 ring-white"
									/>

								</a>
								<a className="" href="https://vk.com/anoasi24" >
									<img
										alt=""
										src=".././VK_Logo.svg"
										className="inline-block hover:scale-125 duration-150 size-10 mr-5 rounded-full ring-2 ring-white"
									/>
								</a>
								<a className="" href="https://links.gemspace.com/local-space/cc4c590b9fbd693a1deb770c5679666e" >
									<img
										alt=""
										src="https://asi24.ru/wp-content/uploads/2024/11/Chat-Video-Calls-Gem-Space-2.webp"
										className="inline-block hover:scale-125 duration-150 size-10 mr-5 rounded-full ring-2 ring-white"
									/>
								</a>
							</div>
							<div className="block my-4 lg:my-auto">
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