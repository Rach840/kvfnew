"use client";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/src/shared/ui/button";
import { RadioGroup, RadioGroupItem } from "@/src/shared/ui/radio-group";
import { Label } from "@/src/shared/ui/label";
import {
    getTestText,
    updateUserTestInfo,
    updateUserStartTestInfo,
} from "@/src/app/actions";
import { getUserSession } from "@/src/shared/lib/get-session-server";

import Skeleton from "@mui/material/Skeleton";
import { Alert } from "@mui/material";
import Link from "next/link";
import NonAuth from "@/src/shared/ui/non-auth";
import RadialChart from "@/src/shared/ui/radial-chart";
import { Question, tinyTest, UserTests } from "@/src/shared/model/types";
import { User } from "@/src/db/schema";


// Import the getTestText function from wherever it's defined

export function TestPage() {
    const pathName = usePathname().replace("/test/", "");
    const [questions, setQuestions] = React.useState<Question[]>([]);
    const [userAnswers, setUserAnswers] = React.useState<number[]>([]);
    const [showResults, setShowResults] = React.useState(false);
    const [testName, setTestName] = React.useState<string>();
    const [testId, setTestId] = React.useState<number>();
    const [score, setScore] = React.useState(1);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [user, setUser] = React.useState<User>();
    const [userTestsName, setUserTestsName] = React.useState();
    const router = useRouter();
    React.useEffect(() => {
        (async () => {
            try {
                const session = await getUserSession();

                if (session != null) {
                    setUser(session);
                }
                if (session && !session?.emailVerified) {
                    router.replace("/verification-request")
                }

                setIsLoading(true);
                const test: tinyTest = await getTestText(pathName);
                setTestName(test?.name);
                if (test && "text" in test) {
                    const parsedQuestions: Question[] = shuffle(JSON.parse(test.text));
                    setTestId(test.id)
                    setQuestions(parsedQuestions);
                    setUserAnswers(new Array(parsedQuestions.length).fill(-1));
                } else {
                    setError("Test not found or invalid data");
                }
            } catch (err) {
                console.log(err);
                setError("Failed to load test");
            } finally {
                setIsLoading(false);
            }
        })();
    }, [pathName]);

    const [questionsCurrentIndex, setQuestionsCurrent] = useState(0);
    useEffect(() => {
        if (user) {
            const userTestResponse = JSON.parse(user.testsResult);

            if (userTestResponse.length >= 1) {
                const userTestName = userTestResponse.map((elem: UserTests) => elem.testName);
                setUserTestsName(userTestName);
            }
        }
    }, [user]); //
    const handleAnswerChange = (questionIndex: number, answerIndex: number) => {
        setUserAnswers((prev) => {
            const newAnswers = [...prev];
            newAnswers[questionIndex] = answerIndex;
            return newAnswers;
        });
    };
    function shuffle(array: []): [] {
        let temporaryValue;
        let randomIndex;

        for (let i = array.length; 0 !== i;) {
            randomIndex = Math.floor(Math.random() * i);
            --i;
            temporaryValue = array[i];
            array[i] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    let noAnswerGlobal = -1;
    const calculateScore = async () => {
        let questionScore = 0;
        noAnswerGlobal = userAnswers.findIndex((value) => value == -1);

        if (noAnswerGlobal != -1) {
            goToNoAnswer();
            return;
        }
        questions.forEach((question, index) => {
            if (question.correctAnswer === userAnswers[index]) {
                questionScore += +question.questionScore;
            }
        });

        setScore(questionScore);
        setShowResults(true);
        if (user) {
            const testsUsers = JSON.parse(user.testsResult);
            const answerHistory = questions.map((elem, index) => {
                return {
                    question: elem.question,
                    options: elem.options,
                    questionScore: elem.questionScore,
                    userAswers: userAnswers[index]
                };
            });
            const testUsersString = JSON.stringify([
                ...testsUsers,
                {
                    id: testId,
                    testName: testName,
                    score: questionScore,
                    answerHistory: answerHistory,
                    passedDate: new Date().getTime() + "",
                },
            ]);
            console.log(new Date().getTime());
            if (
                pathName == "otborochnyy-test" ||
                pathName == "trenirovochnyy-test" ||
                pathName == "osnovnoy-test"
            ) {
                await updateUserStartTestInfo(
                    Number(user.id),
                    questionScore,
                    new Date().getTime() + ""
                );
                await updateUserTestInfo(Number(user.id), testUsersString);
            } else {
                await updateUserTestInfo(Number(user.id), testUsersString);
            }

            // .then(() => {
            //   router.replace("/testResult");
            // });
        } else {
            alert("ошибка!");
        }
    };

    useEffect(() => {
        if (userTestsName?.includes(testName)) {
            const userTestIndex = JSON.parse(user.testsResult).findIndex(
                (value) => value.testName === testName
            );
            if (userTestIndex !== -1) {
                const userTest = JSON.parse(user.testsResult)[userTestIndex];
                setScore(userTest.score);
            }
        }
    }, [userTestsName, testName, user]);
    function nextQuestion() {
        if (questionsCurrentIndex + 1 < questions.length) {
            setQuestionsCurrent(questionsCurrentIndex + 1);
        } else {
            return;
        }
    }

    function goToNoAnswer() {
        setQuestionsCurrent(noAnswerGlobal);
    }
    function prevQuestion() {
        if (0 < questionsCurrentIndex) {
            setQuestionsCurrent(questionsCurrentIndex - 1);
        } else {
            return;
        }
    }

    // console.log(userTestsName)
    if (isLoading) {
        return (
            <div className="container mx-auto p-4">
                <Skeleton
                    animation="wave"
                    height={60}
                    width="40%"
                    style={{ marginLeft: "auto", marginRight: "auto", marginBottom: 6 }}
                />

                <div
                    key={questionsCurrentIndex}
                    className="relative w-8/12 container mx-auto flex h-full ring-black/5 max-lg:rounded-t-[2rem] my-6 py-10  shadow ring-1 flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)] p-4"
                >
                    <Skeleton
                        animation="wave"
                        height={180}
                        width="100%"
                        style={{ marginBottom: 15 }}
                    />

                    <Skeleton
                        animation="wave"
                        height={45}
                        width="100%"
                        style={{ marginBottom: 1 }}
                    />
                    <Skeleton
                        animation="wave"
                        height={45}
                        width="100%"
                        style={{ marginBottom: 1 }}
                    />
                    <Skeleton
                        animation="wave"
                        height={45}
                        width="100%"
                        style={{ marginBottom: 1 }}
                    />
                    <Skeleton
                        animation="wave"
                        height={45}
                        width="100%"
                        style={{ marginBottom: 1 }}
                    />
                </div>

                <div className="flex items-center justify-center">
                    <Skeleton
                        animation="wave"
                        height={65}
                        width="15%"
                        style={{ marginRight: 8, marginLeft: 8 }}
                    />
                    <Skeleton
                        animation="wave"
                        height={65}
                        width="15%"
                        style={{ marginRight: 8, marginLeft: 8 }}
                    />
                    <Skeleton
                        animation="wave"
                        height={65}
                        width="15%"
                        style={{ marginRight: 8, marginLeft: 8 }}
                    />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <NonAuth />
        );
    }

    if (questions.length === 0) {
        return (
            <>
                <div className="relative container mx-auto flex h-full ring-black/5 max-lg:rounded-t-[2rem] my-6 py-10  shadow ring-1 flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
                    <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                        <h4 className="mt-2 text-4xl text-center font-medium tracking-tight text-gray-950 max-lg:text-center">
                            Такого теста нету
                        </h4>
                    </div>
                    <div className="flex flex-1 justify-center mt-10 px-10 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-12">
                        <Link
                            href="/login"
                            className="duration-300 mr-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Войти
                        </Link>
                        <Link
                            href="/register"
                            className="duration-300 mr-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Зарегистрироваться
                        </Link>
                    </div>
                </div>
            </>
        );
    }
    if (userTestsName?.includes(testName) || showResults) {
        const maxScoreNums = questions.map((elem) => Number(elem.questionScore));
        const maxScore: number = maxScoreNums.reduce((a, b) => a + b, 0);

        const scoreProcent = (score / maxScore) * 100;

        return (
            <>
                <div className="relative bg-white w-full lg:w-8/12 container mx-auto flex h-full ring-black/5 max-lg:rounded-t-[2rem] my-6 py-10  shadow ring-1 flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)] p-4">
                    <h2 className="text-3xl font-bold mb-4 text-center">Поздравляем!</h2>
                    <RadialChart valueNum={scoreProcent} />

                    <h4 className="text-2xl font-bold mb-4 text-center">
                        Вы решили тест на {`${Math.round(scoreProcent)}%`}
                    </h4>
                </div>
            </>
        );
    } else if (user) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4 text-center">{testName} </h1>
                {noAnswerGlobal != -1 ? (

                    <Alert severity="error">Вы полностью не заполнили ответы!.</Alert>

                ) : (
                    <></>
                )}

                <div
                    key={questionsCurrentIndex}
                    className="relative w-full lg:w-8/12 bg-white container mx-auto flex h-full ring-black/5 max-lg:rounded-t-[2rem] my-6 py-10  shadow ring-1 flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)] p-4"
                >
                    <h2 className="text-xl font-semibold mb-2">
                        Вопрос {questionsCurrentIndex + 1}:{" "}
                        {questions[questionsCurrentIndex].question}
                    </h2>
                    {questions[questionsCurrentIndex].image == "" ? (
                        <></>
                    ) : (
                        <img
                            src={questions[questionsCurrentIndex].image}
                            className="mb-4"
                        />
                    )}
                    <RadioGroup
                        value={userAnswers[questionsCurrentIndex]?.toString() || ""}
                        onValueChange={(value) =>
                            handleAnswerChange(questionsCurrentIndex, parseInt(value))
                        }
                    >
                        {questions[questionsCurrentIndex].options.map(
                            (option, optionIndex) => (
                                <div
                                    key={optionIndex}
                                    className="flex my-2 items-center space-x-2"
                                >
                                    <RadioGroupItem
                                        value={optionIndex.toString()}
                                        id={`q${questionsCurrentIndex}-o${optionIndex}`}
                                    />
                                    <Label
                                        className="text-lg "
                                        htmlFor={`q${questionsCurrentIndex}-o${optionIndex}`}
                                    >
                                        {option}
                                    </Label>
                                </div>
                            )
                        )}
                    </RadioGroup>
                </div>

                <div className="flex flex-wrap items-center justify-center">
                    <Button onClick={prevQuestion} className=" mt-4">
                        Предыдущий вопрос
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={calculateScore}
                        className="mx-3 mt-4"
                    >
                        Завершить тест
                    </Button>
                    <Button onClick={nextQuestion} className="mt-4">
                        Следущий вопрос
                    </Button>
                </div>
            </div>
        );
    } else {
        return (
            <NonAuth />
        );
    }
}