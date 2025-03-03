"use server";

import { prisma } from "@/prisma/prisma-client";
import { hashSync } from "bcryptjs";
import { createTransport } from "nodemailer"
import {Prisma, Teams} from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { JsonValue } from "@prisma/client/runtime/library";

export interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  questionScore: number;
  image: string;
}
const emailStyles = '        body {\n    background-color: #f4f4f4;\n    margin: 0;\n    padding: 20px;\n  }\n.container {\n    background-color: white;\n    border-radius: 5px;\n    color: #000;\n    padding: 20px;\n    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);\n    max-width: 600px;\n    margin: auto;\n    font-size: 1.3rem;\n  }\n  h1 {\n    font-size:1.4rem;\n    color: #ffbd33;\n  }\n.footer {\n    margin-top: 20px;\n    font-size: 0.9em;\n    color: #777;\n  }\n.button {\n    background-color: #ffbd33;\n    color: #fff;\n    padding: 10px 15px;\n    text-decoration: none;\n    border-radius: 5px;\n    display: inline-block;\n    margin-top: 20px;\n  }'
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
const transportMail = {
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },

}


export async function registerTeam(
    body: Prisma.TeamsCreateInput,
    userId: string,
): Promise<RegisterTeamResult> {
  try {
    const team = await prisma.teams.findFirst({
      where: {
        name: body.name,
      },
    });

    if (team) {
      return { success: false, message: "Команда с таким названием уже существует" };
    } else {
      console.log(body)
      const teamId = uuidv4();
      const members = [userId]
      const createdTeam = await prisma.teams.create({
        data: {
          id: teamId,
          name: body.name,
          country: body.country,
          supervisorId:body.supervisorId,
          region: body.region,
          city: body.city,
          institution: body.institution,
          supervisorPhone:body.supervisorPhone,
          captainPhone: body.captainPhone,
          supervisorEmail: body.supervisorEmail,
          captainEmail: body.captainEmail,
          vkGroupUrl: body.vkGroupUrl,
          captainFullName: body.captainFullName,
          supervisorFullName: body.supervisorFullName,
         members: JSON.stringify(members)
        },
      });
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          teamMember: teamId,
          memberRole: 'SUPERVISOR'
        },
      })
      const transport = createTransport(transportMail);
      await transport.sendMail({
        to: body.supervisorEmail,
        from: process.env.EMAIL_FROM,
        subject: `Команда "${body.name}" зарегистрирована!`,
        text: "Код для приглащения в сообщении",
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Команда "${body.name}" зарегистрирована</title>
    <style>
   ${emailStyles}
    </style>
</head>
<body>
<img src="https://asi24.ru/wp-content/uploads/2024/10/logoasi24.jpg" width="109" height="55"/>

    <div class="container">
        <h1>Успешная регистрация!</h1>
        <p>Дорогой ${body.supervisorFullName},</p>
        <p>Ваша команда, <strong>${body.name}</strong>, была успешна зарегистрирована в Большой Финансовой Игре.</p>
        <p>Можете пригласить новых участников по этому коду: <strong>${teamId}</strong></p>
        <p>Ждем вас на игре!</p>
        <p>Можете посмотреть полную информацию по команде, нажав на кнопку.</p>

        <a href="http://localhost:3000" class="button">Посмотреть команду</a>

        <div class="footer">
            <p>C уважением,<br>
            АНО Агентство социальных инициатив</p>
        </div>
    </div>

</body>
</html>`,
      })

      return { success: !!createdTeam };
    }
  } catch (err) {
    console.log(err)
    return { success: false };
  }
}
export async function joinTeam(
    body: { key:string },
    user: Users,
): Promise<RegisterTeamResult> {
  console.log(body.key)
  try {
    const team = await prisma.teams.findUnique({
      where: {
        id: body.key,
      },
    });
    console.log(team);
if (!team) {
  return { success: false, message:'Команды с таким пригласительным кодом не существует' };
}

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          teamMember: team.id,
          memberRole: 'MEMBER'
        },
      })
    const members = JSON.parse(team.members);
members.push(user.id);
    await prisma.teams.update({
      where: {
        id: body.key,
      },
      data: {
       members: JSON.stringify(members),
      },
    })

      const transport = createTransport(transportMail);
    await transport.sendMail({
        to: user.email,
        from: process.env.EMAIL_FROM,
        subject: `Вы вступили в команду "${team.name}"!`,
        html: `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Вы вступили в команду "${team.name}"!</title>
    <style>
   ${emailStyles}
    </style>
</head>
<body>
<img src="https://asi24.ru/wp-content/uploads/2024/10/logoasi24.jpg" width="109" height="55"/>

    <div class="container">
        <h1>Вы вступили в команду ${team.name}!</h1>
        <p>Дорогой ${user.name},</p>
        <p>Ваша заявка на вступление в команду, <strong>${team.name}</strong>, была успешна одобрена.</p>
        <p>Ждем вас в игре!</p>
        <p>Можете посмотреть полную информацию по команде, нажав на кнопку.</p>

        <a href="http://localhost:3000" class="button">Посмотреть команду</a>

        <div class="footer">
            <p>C уважением,<br>
            АНО Агентство социальных инициатив</p>
        </div>
    </div>

</body>
</html>`,
      })

      return { success: true };

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
type RegisterTeamResult = {
  success: boolean;
  message?: string;
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
export async function getAllTeam(): Promise<Teams[]> {
  try {
    const teams = await prisma.teams.findMany();
    return teams;
  } catch (err) {
    console.log(err)
    return [];
  }
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

export async function getNameTestById(id: number) {
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

export async function getTeamMember(id: string) {
  try {
    const team = await prisma.teams.findUnique({
      where: {
        id: id,
      },
    });
    const membersId = JSON.parse(team.members);
    const members = await prisma.user.findMany({
      where: {
        id: {
          in: membersId.map(id => id)
        }
      }
    })
    const membersResult = team;
    membersResult.members = members.map((member) => {
      return {
        id: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
        surName: member.surName,
        email: member.email,
        testResult: JSON.parse(member.testsResult)[0],
        memberRole: member.memberRole,
        testPassed: member.testPassed,
      }
    });
    return membersResult;
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
        id: true,
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
