import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";
import { v4 } from "uuid";
const s3Client = new S3Client({});
async function handler(event: APIGatewayProxyEvent, context: Context) {
  const comands = new ListBucketsCommand({});
  const listBuckets = (await s3Client.send(comands)).Buckets;
  const response = {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello World!", tableName: process.env.TABLE_NAME, buckets: JSON.stringify(listBuckets), requestId: v4() }),
  };
  console.log({ event });
  return response;
}

export { handler };
