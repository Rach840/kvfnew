"use server";

import { prisma } from "@/prisma/prisma-client";
import { hashSync } from "bcryptjs";

import { Prisma } from "@prisma/client";
// import { v4 as uuidv4 } from "uuid";
import { Question } from "./create-test/[test]/page";
import { JsonValue } from "@prisma/client/runtime/library";


export async function registerUser(
  body: Prisma.UserCreateInput
): Promise<RegisterResult> {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (user) {
      return { success: false };
    } else {
      const createdUser = await prisma.user.create({
        data: {
          firstName: body.firstName,
          lastName: body.lastName,
          surName: body.surName,
          email: body.email,
          password: hashSync(body.password, 10),
          startTest: body.startTest,
          organisation: body.organisation,
          role: body.role,
          okAnswers: 0,
          testsResult: "[]",
        },
      });



      return { success: !!createdUser };
    }
  } catch (err) {
    console.log(err)
    return { success: false };
  }
}

export async function updateProfile(
  body: Prisma.UserUncheckedUpdateInput
): Promise<ProfileEdited> {
  try {
    await prisma.user.update({
      where: {
        id: body.id as number,
      },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
      },
    });
    return { edit: true };
  } catch (err) {
    console.error(err);
    return { edit: false };
  }
}

type RegisterResult = {
  success: boolean;
};

type ProfileEdited = {
  edit: boolean;
};

export type Users = {
  id: number;
  firstName: string;
  lastName: string;
  surName: string;
  email: string;
  organisation: string;
  role: string;
  testPassed: boolean;
  startTest: string;
  passedDate: string;
  testsResult: string;
  okAnswers: number;
  emailVerified: Date | null;
};
export type UserTests = {
  testName: string;
  score: number;
  passedDate: string
}
export async function getAllUsers(): Promise<Users[]> {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: {
          in: ["SCHOOLBOY", "STUDENT", "SPECIALIST"],
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        surName: true,
        email: true,
        organisation: true,
        role: true,
        startTest: true,
        testPassed: true,
        passedDate: true,
        testsResult: true,
        okAnswers: true,
      },
    });
    return users;
  } catch (err) {
    console.log(err)
    return [];
  }
}

function translit(word: string) {
  const converter: { [key: string]: string } = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
    'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i',
    'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
    'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
    'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch',
    'ш': 'sh', 'щ': 'sch', 'ь': '', 'ы': 'y', 'ъ': '',
    'э': 'e', 'ю': 'yu', 'я': 'ya'
  };

  word = word.toLowerCase();

  let answer = '';
  for (let i = 0; i < word.length; ++i) {
    if (converter[word[i]] == undefined) {
      answer += word[i];
    } else {
      answer += converter[word[i]];
    }
  }

  answer = answer.replace(/[^-0-9a-z]/g, '-');
  answer = answer.replace(/[-]+/g, '-');
  answer = answer.replace(/^\-|-$/g, '');
  return answer;
}





export async function createTest(body: Prisma.TestCreateInput) {
  try {
    const test = await prisma.test.create({
      data: {
        category: body.category,
        name: body.name,
        nameTranslit: translit(body.name),
        text: "[]",
      },
    });
    return test;
  } catch (err) {
    return err;
  }
}

export type Tests = {
  id: number;
  category: string;
  name: string;
  nameTranslit: string;
  testDisable: boolean;
  text?: JsonValue;
};
export async function getTests(): Promise<Tests[] | undefined> {
  try {
    const tests = await prisma.test.findMany({
      select: {
        id: true,
        name: true,
        nameTranslit: true,
        category: true,
        testDisable: true,
      },
    });
    return tests;
  } catch (err) {
    console.log(err)

    return [];
  }
}

export async function deleteTest(id: number) {
  await prisma.test.delete({
    where: {
      id: id,
    },
  });

}
export async function testBlocked(id: number) {
  const testEnable = await prisma.test.findFirst({
    where: {
      id: id,
    },
    select: {
      testDisable: true
    }
  });
  console.log(testEnable)
  if (testEnable?.testDisable == true) {
    await prisma.test.update({
      where: {
        id: id,
      },
      data: {
        testDisable: false,
      },
    });
  } else {
    await prisma.test.update({
      where: {
        id: id,
      },
      data: {
        testDisable: true,
      },
    });
  }

}

export async function getTest(id: number): Promise<Tests | null> {
  try {
    const test = await prisma.test.findUnique({
      where: {
        id: id,
      },
    });
    return test;
  } catch (err) {
    console.log(err)

    return null;
  }
}

export async function saveCompletedTest(id: number, test: Question[]) {
  try {
    const result = await prisma.test.update({
      where: {
        id: id,
      },
      data: {
        text: JSON.stringify(test),
      },
    });
    return result;
  } catch (error) {
    console.log(error)

    return error;
  }
}

export async function getTetsById(id: number) {
  try {
    const test = await prisma.test.findUnique({
      where: {
        id: id,
      },
      select: {
        name: true,
      },
    });
    return test;
  } catch (err) {
    console.log(err)

    return [];
  }
}
export async function getTextById(id: number) {
  try {
    const test = await prisma.test.findUnique({
      where: {
        id: id,
      },
      select: {
        text: true,
      },
    });
    return test;
  } catch (err) {
    console.log(err)
    return [];
  }
}
export async function getIdTest(role: string) {
  try {
    const test = await prisma.test.findMany({
      where: {
        category: {
          in: [role],
        },
      },
      select: {
        id: true,
      },
    });
    return test;
  } catch (err) {
    console.log(err)

    return [];
  }
}

export async function getTestText(pathName: string) {
  try {
    const test = await prisma.test.findFirst({
      where: {
        nameTranslit: pathName,
      },
      select: {
        name: true,
        text: true,
      },
    });
    return test;
  } catch (error) {
    console.log(error)

    return error;
  }
}

export async function updateUserTestInfo(userId: number, answers: string) {
  try {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        testPassed: true,
        testsResult: answers,
      },
    });
    console.log(user);
    return user;
  } catch (error) {
    console.log(error);
  }
}
export async function updateUserStartTestInfo(userId: number, answers: number, date: string) {
  try {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        testPassed: true,
        okAnswers: answers,
        passedDate: date
      },
    });
    console.log(user);
    return user;
  } catch (error) {
    console.log(error);
  }
}
export async function getUsersData() {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: {
          in: ["SCHOOLBOY", "STUDENT", "SPECIALIST"],
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        surName: true,
        email: true,
        organisation: true,
        testPassed: true,
        startTest: true,
        passedDate: true,
        role: true,
        testsResult: true,
      },
    });
    return users;
  } catch (error) {
    console.error("Ошибка:", error);
    throw new Error("Ошибка при получении данных пользователей");
  }
}
