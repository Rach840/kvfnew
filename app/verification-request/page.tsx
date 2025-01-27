
import React from "react";

export default function VerificationPage() {
	return (

		<div className="relative bg-white container w-5/5 lg:w-4/5 xl:w-3/5 px-9 mx-auto flex h-full ring-black/5 max-lg:rounded-t-[2rem] my-6 py-10  shadow ring-1 flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
			<div className="flex items-center">
				<div className="w-3/4">
					<h2 className="mt-2 text-4xl text-center font-medium tracking-tight text-gray-950 max-lg:text-center">
						Вам было отправлено письмо
					</h2>
					<h4 className="mt-2 text-2xl text-center font-medium tracking-tight text-gray-950 max-lg:text-center">
						Вам на почту было отправлено письмо для подтверждения email, пожалуйста, проверьте почту и войдите в аккаунт через письмо
					</h4></div>


				<img src=".././registr.png" alt="Verification Request" className=" top-0 left-0 w-1/6  h-full object-cover" />
			</div>


		</div>
	)
}