import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  let message: string;
  switch (event.httpMethod) {
    case "GET":
      message = "GET method";
      break;
    case "POST":
      message = "POST method";
      break;
    default:
      return { statusCode: 405, body: "Method Not Allowed" };
  }
  const response = {
    statusCode: 200,
    body: JSON.stringify({ message }),
  };
  console.log({ event });
  return response;
}

export { handler };
