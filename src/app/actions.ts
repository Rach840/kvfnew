"use server";

import { prisma } from "@/prisma/prisma-client";
import { hashSync } from "bcryptjs";
import { createTransport } from "nodemailer"
import { v4 as uuidv4 } from "uuid";
import { JsonValue } from "@prisma/client/runtime/library";
import {teams, Teams, Test, test, User, user} from "../db/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";
import {Question, ResponceResult, Tests} from "../shared/model/types";


const emailStyles = '        body {\n    background-color: #f4f4f4;\n    margin: 0;\n    padding: 20px;\n  }\n.container {\n    background-color: white;\n    border-radius: 5px;\n    color: #000;\n    padding: 20px;\n    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);\n    max-width: 600px;\n    margin: auto;\n    font-size: 1.3rem;\n  }\n  h1 {\n    font-size:1.4rem;\n    color: #ffbd33;\n  }\n.footer {\n    margin-top: 20px;\n    font-size: 0.9em;\n    color: #777;\n  }\n.button {\n    background-color: #ffbd33;\n    color: #fff;\n    padding: 10px 15px;\n    text-decoration: none;\n    border-radius: 5px;\n    display: inline-block;\n    margin-top: 20px;\n  }'
export async function registerUser(
  body: User
): Promise<RegisterResult> {
  try {
    const userItem = await db.select().from(user).where(eq(user.email, body.email));
    if (userItem) {
      return { success: false };
    } else {

      const createdUser = await db.insert(user).values({
        firstName: body.firstName,
        lastName: body.lastName,
        surName: body.surName,
        email: body.email,
        country: body.country,
        city: body.city,
        region: body.region,
        phone: body.phone,
        vkUrl: body.vkUrl,
        nameTeam: body.nameTeam,
        password: hashSync(body.password, 10),
        startTest: body.startTest,
        organisation: body.organisation,
        okAnswers: 0,
        testsResult: "[]",
      })


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
    body: Teams,
    userId: string,
): Promise<RegisterTeamResult> {
  try {

    const team = await db.select().from(teams).where(eq(teams.name, body.name));

    if (team.length) {
      return { success: false, message: "Команда с таким названием уже существует" };
    } else {
      const teamId = uuidv4();
      const members = [userId]
      const createdTeam = await db.insert(teams).values({
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
      })
      await db.update(user).set({
        teamMember: teamId,
        memberRole: 'SUPERVISOR'
      }).where(eq(user.id, Number(userId)))
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
    userItem: User,
): Promise<RegisterTeamResult> {
  console.log(body.key)
  try {
    const team = await db.select().from(teams).where(eq(body.key, teams.id))
    console.log(team);
if (!team) {
  return { success: false, message:'Команды с таким пригласительным кодом не существует' };
}

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {

        },
      });
await db.update(user).set({
  teamMember: team[0].id,
  memberRole: 'MEMBER'
})
    const members = JSON.parse(team[0].members);
members.push(userItem.id);


await db.update(teams).set({
  members: JSON.stringify(members),
}).where(eq(teams.id, body.key));


      const transport = createTransport(transportMail);

    await transport.sendMail({
        to: user.email,
        from: process.env.EMAIL_FROM,
        subject: `Вы вступили в команду "${team[0].name}"!`,
        html: `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Вы вступили в команду "${team[0].name}"!</title>
    <style>
   ${emailStyles}
    </style>
</head>
<body>
<img src="https://asi24.ru/wp-content/uploads/2024/10/logoasi24.jpg" width="109" height="55"/>

    <div class="container">
        <h1>Вы вступили в команду ${team[0].name}!</h1>
        <p>Дорогой ${userItem.firstName},</p>
        <p>Ваша заявка на вступление в команду, <strong>${team[0].name}</strong>, была успешна одобрена.</p>
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
  body: User
): Promise<ResponceResult> {
  try {
    await db.update(user).set({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
    }).where(eq(body.id, user.id))
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
}





export async function getAllTeam(): Promise<Teams[]> {
  try {
    const teamItems = await db.select().from(teams);
    return teamItems;
  } catch (err) {
    console.log(err)
    return [];
  }
}


export async function getAllUsers(): Promise<User[]> {
  try {
    const users = await db.select().from(user).where(eq(user.role, 'USER'));
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


export async function createTest(body: Tests) {
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


export async function getTests(): Promise<Tests[] | undefined> {
  try {

    const tests = await db.select().from(test);
    return tests;
  } catch (err) {
    console.log(err)

    return [];
  }
}

export async function deleteTest(id: number) {
await db.delete(test).where(eq(test.id,id))
}
export async function testBlocked(id: number) {

  const testEnable = await db.select().from(test).where(eq(test.id,id))
  // if (testEnable[0]?.testDisable == true) {
  //   await db.update(test).set({
  //     testDisable: false,
  //   }).where(eq(test.id,id))
  // } else {
  //   await db.update(test).set({
  //     testDisable: (testEnable[0]?.testDisable == true) ? false : true,
  //   }).where(eq(test.id,id))
  // }
  await db.update(test).set({
    testDisable: (testEnable[0]?.testDisable == true) ? false : true,
  }).where(eq(test.id,id))
}

export async function getTest(id: number): Promise<Test | null> {
  try {
    const testItem = await db.select().from(test).where(eq(test.id,id))
    return testItem[0];
  } catch (err) {
    console.log(err)
    return null;
  }
}

export async function saveCompletedTest(id: number, questions: Question[]) {
  try {
    const result = await db.update(test).set({
      text: JSON.stringify(questions),
    }).where(eq(test.id,id))
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
