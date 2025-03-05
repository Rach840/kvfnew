import { User } from "@/src/db/schema";

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

    export interface UsersUnPackage extends User {
        testsResult: UserTests;
    }