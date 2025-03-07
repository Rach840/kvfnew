import { User } from "@/src/db/schema";
import { json } from "drizzle-orm/mysql-core";
export interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  questionScore: number;
  image?: string;
}
export type UserTests = {
  testName: string;
  score: number;
  passedDate: string
}

export interface tinyTest {
  id: number;
  name: string;
  text: string
}
export type Tests = {
    id: number;
    category: string;
    name: string;
    nameTranslit: string;
    testDisable: boolean;
    text?: json;
};
export type ResponceResult = {
    success: boolean;
    message?: string;
};
export type ProfileEdited = {
    edit: boolean;
};

export interface UsersUnPackage extends User {
        testsResult: UserTests;
}