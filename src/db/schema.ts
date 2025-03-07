import { mysqlTable, mysqlSchema, AnyMySqlColumn, primaryKey, unique, varchar, json, int, datetime, mysqlEnum, tinyint, boolean } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const teams = mysqlTable("Teams", {
	id: varchar({ length: 191 }).primaryKey().notNull(),
	name: varchar({ length: 191 }).notNull(),
	members: json().notNull(),
	captainId: int(),
	supervisorId: int().notNull(),
	country: varchar({ length: 191 }).notNull(),
	region: varchar({ length: 191 }).notNull(),
	city: varchar({ length: 191 }).notNull(),
	institution: varchar({ length: 191 }).notNull(),
	supervisorFullName: varchar({ length: 191 }).notNull(),
	captainFullName: varchar({ length: 191 }).notNull(),
	supervisorPhone: varchar({ length: 191 }).notNull(),
	captainPhone: varchar({ length: 191 }).notNull(),
	supervisorEmail: varchar({ length: 191 }).notNull(),
	captainEmail: varchar({ length: 191 }).notNull(),
	vkGroupUrl: varchar({ length: 191 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "Teams_id"}),
	unique("Teams_name_key").on(table.name),
]);

export const test = mysqlTable("Test", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 191 }).notNull(),
	nameTranslit: varchar({ length: 191 }).notNull(),
	category: varchar({ length: 191 }).notNull(),
	text: json().notNull(),
	testDisable: boolean().default(false).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "Test_id"}),
]);

export const user = mysqlTable("User", {
	id: int().autoincrement().primaryKey(),
	firstName: varchar({ length: 191 }).notNull(),
	lastName: varchar({ length: 191 }).notNull(),
	surName: varchar({ length: 191 }).default('').notNull(),
	nameTeam: varchar({ length: 191 }).notNull(),
	country: varchar({ length: 191 }).notNull(),
	region: varchar({ length: 191 }).notNull(),
	city: varchar({ length: 191 }).notNull(),
	phone: varchar({ length: 191 }).notNull(),
	vkUrl: varchar({ length: 191 }).notNull(),
	password: varchar({ length: 191 }).notNull(),
	email: varchar({ length: 191 }).notNull(),
	organisation: varchar({ length: 191 }).notNull(),
	testPassed: tinyint().default(0).notNull(),
	passedDate: varchar({ length: 191 }).default('').notNull(),
	startTest: mysqlEnum(['START','RESULT']).default('START').notNull(),
	role: mysqlEnum(['USER','ADMIN']).default('USER').notNull(),
	testsResult: json().notNull(),
	okAnswers: int().notNull(),
	emailVerified: datetime({ mode: 'string', fsp: 3 }),
	teamMember: varchar({ length: 191 }),
	memberRole: mysqlEnum(['SUPERVISOR','CAPTAIN','MEMBER']),
},
(table) => [
	primaryKey({ columns: [table.id], name: "User_id"}),
	unique("User_email_key").on(table.email),
]);

export const verificationToken = mysqlTable("VerificationToken", {
	identifier: varchar({ length: 191 }).notNull(),
	token: varchar({ length: 191 }).notNull(),
	expires: datetime({ mode: 'string', fsp: 3 }).notNull(),
},
(table) => [
	unique("VerificationToken_identifier_token_key").on(table.identifier, table.token),
]);


export type User = typeof user.$inferSelect;
export type Test = typeof test.$inferSelect;
export type Teams = typeof teams.$inferSelect;