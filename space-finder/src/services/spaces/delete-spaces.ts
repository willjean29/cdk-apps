import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function deleteSpaces(event: APIGatewayProxyEvent, dbClient: DynamoDBDocumentClient): Promise<APIGatewayProxyResult> {
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
