import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { hasAdminGroup } from "../shared/utils";

export async function deleteSpaces(event: APIGatewayProxyEvent, dbClient: DynamoDBDocumentClient): Promise<APIGatewayProxyResult> {
  console.log({ event });
  if (!hasAdminGroup(event)) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: "Forbidden to delete spaces" }),
    };
  }
  const params = event.queryStringParameters;

  if (params && params.id) {
    const spaceId = params.id;
    await dbClient.send(
      new DeleteCommand({
        TableName: process.env.TABLE_NAME,
        Key: { id: spaceId },
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Item deleted with id ${spaceId}` }),
    };
  }
  return {
    statusCode: 400,
    body: JSON.stringify({ message: "Please provide right args" }),
  };
}
