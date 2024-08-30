import { APIGatewayProxyEvent, Context } from "aws-lambda";

async function handler(event: APIGatewayProxyEvent, context: Context) {
  const response = {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello World!", tableName: process.env.TABLE_NAME }),
  };
  console.log({ event });
  return response;
}

export { handler };
