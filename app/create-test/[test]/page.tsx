"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useParams } from "next/navigation";
import { saveCompletedTest, getTextById, Users } from "@/app/actions";
import { InputImage } from "@/components/shared/input-image";

import { getUserSession } from "@/lib/get-session-server";
import NotFound from "@/app/not-found";

export interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  questionScore: number;
  image: string;
}

type TextResponse = { text: string } | null;
export default function TestConstructor() {
  const params = useParams();
  const testId = params.test as string;


  const [test, setTest] = useState<Question[]>([]);
  const [idAdmin, setIsAdmin] = useState<boolean>(false);


  React.useEffect(() => {
    (async () => {
      const user: Users | null | undefined = await getUserSession();

      if (user != null && user.role == "ADMIN") {
        setIsAdmin(true)
      }

      const responce: TextResponse = await getTextById(Number(testId))
      console.log(responce)
      if (responce != null && JSON.parse(responce.text).length > 0) {
        const textAll = JSON.parse(responce.text)

        setTest(textAll)
      }

    })();
  }, []);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentOptions, setCurrentOptions] = useState(["", ""]);
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [questionScore, setQuestionScore] = useState<number>(0);
  const [questionImage, setQuestionImage] = useState("");

  const addOption = () => {
    setCurrentOptions([...currentOptions, ""]);
  };
  const removeOption = (index: number) => {
    const newOptions = currentOptions.filter((_, i) => i !== index);
    setCurrentOptions(newOptions);
    if (correctAnswer >= newOptions.length) {
      setCorrectAnswer(newOptions.length - 1);
    }
  };
  function deleteQuestion(index: number) {
    console.log(index)
    test.splice(index, 1,)
    setTest(test);

    setCurrentQuestion("");
    setCurrentOptions(["", ""]);
    setCorrectAnswer(0);
    setQuestionScore(0);
    setQuestionImage("");
  }
  const addQuestion = (index: number) => {
    if (
      currentQuestion.trim() === "" ||
      currentOptions.filter((option) => option.trim() !== "").length < 2
    )
      console.log(index)
    if (index >= 0) {
      test.splice(index + 1, 0, {
        question: currentQuestion,
        options: currentOptions.filter((option) => option.trim() !== ""),
        correctAnswer,
        questionScore,
        image: questionImage,
      })
      setTest(test);
      console.log(test)
    } else {
      setTest([
        ...test,
        {
          question: currentQuestion,
          options: currentOptions.filter((option) => option.trim() !== ""),
          correctAnswer,
          questionScore,
          image: questionImage,
        },
      ]);
    }

    setCurrentQuestion("");
    setCurrentOptions(["", ""]);
    setCorrectAnswer(0);
    setQuestionImage("");
    console.log(currentQuestion);
  };

  const saveTest = async () => {
    await saveCompletedTest(Number(testId), test).then(() => {
      alert("Тест сохранен");
    });
  };
  if (idAdmin) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Конструктор теста</h1>
        <div className="mb-4">
          <Label htmlFor="question">Вопрос</Label>
          <Textarea
            id="question"
            value={currentQuestion}
            onChange={(e) => setCurrentQuestion(e.target.value)}
            className="mt-1"
          />
        </div>
        <div className="mb-4">
          <Input
            onChange={(e) => {
              setQuestionScore(Number(e.target.value));
            }}
            className="flex-grow"
            type="number"
            placeholder={`Сколько баллов даётся за задание`}
          />
          <Label>Приложить картинку</Label>
          {/* <Input
            placeholder="url ссылка"
            onChange={(e) => setQuestionImage(e.target.value)}
          ></Input> */}
          <InputImage testId={testId} onChange={setQuestionImage} />
          <Label>Варианты ответов</Label>
          {currentOptions.map((option, index) => (
            <div key={index} className="flex items-center mt-1">
              <Input
                value={option}
                onChange={(e) => {
                  const newOptions = [...currentOptions];
                  newOptions[index] = e.target.value;
                  setCurrentOptions(newOptions);

                  console.log(newOptions);
                }}
                className="flex-grow"
                placeholder={`Вариант ${index + 1}`}
              />

              <Button
                onClick={() => removeOption(index)}
                variant="destructive"
                className="ml-2"
                disabled={currentOptions.length <= 2}
              >
                Удалить
              </Button>
            </div>
          ))}
          <Button onClick={addOption} className="mt-2">
            Добавить вариант
          </Button>
        </div>
        <div className="mb-4">
          <Label>Правильный ответ</Label>
          <RadioGroup
            value={correctAnswer.toString()}
            onValueChange={(value) => setCorrectAnswer(parseInt(value))}
          >
            {currentOptions.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{`Вариант ${index + 1
                  }`}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <Button onClick={addQuestion} className="mb-4">
          Добавить вопрос
        </Button>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Текущий тест</h2>
          {test.map((q, index) => (
            <div key={index} className="relative p-7 pb-2 pt-6 container mx-auto flex h-full ring-black/5 max-lg:rounded-t-[2rem] my-6 py-10  shadow ring-1 flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
              <p>
                <strong>В{index + 1}:</strong> {q.question}
              </p>
              <ul className="list-disc pl-5">
                {q.options.map((option, optionIndex) => (
                  <li
                    key={optionIndex}
                    className={optionIndex === q.correctAnswer ? "font-bold" : ""}
                  >
                    {option}{" "}
                    {optionIndex === q.correctAnswer && "(Правильный ответ)"}{" "}
                  </li>
                ))}
              </ul>
              <div>Колличество баллов:{q.questionScore}</div>
              <div>Картинка:{q.image}</div>
              <div className="flex mt-6">
                <Button onClick={() => addQuestion(Number(index))} className=" mr-4 mb-4">
                  Добавить вопрос после этого вопроса
                </Button>
                <Button onClick={() => deleteQuestion(Number(index))} className=" mb-4">
                  Удалить вопрос
                </Button>
              </div>

            </div>
          ))}
        </div>
        <Button onClick={saveTest}>Сохранить тест</Button>
      </div>
    );
  } else {
    return <NotFound />
  }

}
