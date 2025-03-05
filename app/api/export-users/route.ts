
import { Users } from "@/app/actions";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";


export default async function GET(responce: Users[]) {

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(responce);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=users.xlsx",
    },
  });
}
