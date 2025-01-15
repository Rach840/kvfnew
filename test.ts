import dotenv from "dotenv";
dotenv.config();
import { s3 } from "./utils/aws";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createReadStream, statSync } from "fs";
import { readFile } from "fs/promises";
import { hash } from "crypto";

(async () => {
  const test_id = 123456789;
  const fileUri = __dirname + "\\package.json";
  const url = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: "kvf",
      Key: `test/${test_id}/${Date.now()}.txt`,
    }),
    { expiresIn: 3600 }
  );
  console.log({ fileUri, url });
  const res = await fetch(url, {
    method: "POST",
    body: createReadStream(fileUri) as any,
    headers: {
      "Content-Length": statSync(fileUri).size.toString(),
    },
  });
  console.log(await res.text());
  console.log("finished");
})();
