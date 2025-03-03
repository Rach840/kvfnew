'use client'
import { getTest } from "@/src/app/actions";
import RadialChart from "@/src/shared/ui/radial-chart";
import { getUserSession } from "@/src/shared/lib/get-session-server";
import { Skeleton } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { Label } from "@/src/shared/ui/label";
import React, { useState } from "react";


export default function ProfileTest() {
	const router = useRouter();
	const pathName = useParams();

	const [currentTest, setCurrentTest] = useState();
	const [currentTestResult, setCurrentTestResult] = useState();

	const [isLoading, setIsLoading] = React.useState(true);
	React.useEffect(() => {
		(async () => {

			const user = await getUserSession();
			const userTest = await getTest(Number(pathName.test));
			console.log(userTest)
			if (user && !user?.emailVerified) {
				router.replace("/verification-request")
			}
			if (user && userTest) {
				const currentUserResult = JSON.parse(user?.testsResult).find((elem) => elem.id === Number(pathName.test));
				const currentOurResult = JSON.parse(userTest?.text).reduce((acc, elem) => acc + +elem.questionScore, 0);


				setCurrentTest(currentUserResult)
				setCurrentTestResult(currentOurResult);

			}
			setIsLoading(false)
		})();
	}, []);

	return (
		<>
			<div className="relative bg-white w-full lg:w-8/12 container mx-auto flex h-full ring-black/5 max-lg:rounded-t-[2rem] my-6 py-10  shadow ring-1 flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)] p-4">

				{!isLoading ? (
					<div>
						<h3 className="text-2xl text-center">Вы прошли тест на {(currentTest.score / currentTestResult * 100).toFixed(0)}%</h3>
						<RadialChart valueNum={currentTest.score / currentTestResult * 100} />

					</div>
				) : <Skeleton
					animation="wave"
					height={320}
					width="100%"
					style={{ marginBottom: 15 }}
				/>}
			</div>

			<div className="container mx-auto">
				{currentTest && currentTestResult ? (
					<div>
						{currentTest.answerHistory.map((elem, index) => (
							<div key={elem.question} className="relative bg-white w-full lg:w-8/12 container mx-auto flex h-full ring-black/5 max-lg:rounded-t-[2rem] my-6 py-10  shadow ring-1 flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)] p-4">
								<h2 className="text-xl font-semibold mb-2">
									Вопрос {index + 1}:{" "}
									{elem.question}
								</h2>
								{elem.options.map((option, optionIndex) => (
									<div
										key={optionIndex}
										className="flex my-2 px-6 items-center space-x-2"
									>
										<Label
											className={optionIndex == elem.userAswers ? "text-lg font-bold" : 'text-lg'}
										>
											{option}
										</Label>
									</div>
								)
								)}
								<p className="text-xl mt-3">Вы выбрали {+elem.userAswers + 1} вариант. За вопрос давалось {elem.questionScore} баллов.</p>
							</div>
						))}
						<div className="relative bg-white w-full lg:w-8/12 container mx-auto flex h-full ring-black/5 max-lg:rounded-t-[2rem] my-6 py-10  shadow ring-1 flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)] p-4">
							<h4 className="text-xl ">Поздравляем! Вы набрали {currentTest.score} из {currentTestResult} баллов. Это {((currentTest.score / currentTestResult) * 100).toFixed(0)}%.</h4>
						</div>
					</div>



				) : (
					<div className="container mx-auto p-4">


						<Skeleton
							animation="wave"
							height={200}
							className="mx-auto"
							width="70%"
							style={{ marginBottom: 0.2 }}
						/>
						<Skeleton
							animation="wave"
							height={200}
							className="mx-auto"
							width="70%"
							style={{ marginBottom: 0.2 }}
						/>
						<Skeleton
							animation="wave"
							height={200}
							className="mx-auto"
							width="70%"
							style={{ marginBottom: 0.2 }}
						/>
						<Skeleton
							animation="wave"
							height={200}
							className="mx-auto"
							width="70%"
							style={{ marginBottom: 0.6 }}
						/>
						<Skeleton
							animation="wave"
							height={200}
							className="mx-auto"
							width="90%"
							style={{ marginBottom: 0.2 }}
						/>
					</div>
				)}

			</div>


		</>

	)
}