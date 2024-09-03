import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function updateSpace(event: APIGatewayProxyEvent, dbClient: DynamoDBDocumentClient): Promise<APIGatewayProxyResult> {
  const params = event.queryStringParameters;

  if (params && params.id && event.body) {
    const data = JSON.parse(event.body);
    if (!data.location) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Please provide location" }),
      };
    }
    const spaceId = params.id;
    const itemResponse = await dbClient.send(
      new UpdateCommand({
        TableName: process.env.TABLE_NAME,
        Key: { id: spaceId },
        UpdateExpression: "set #location = :location",
        ExpressionAttributeNames: {
          "#location": "location",
        },
        ExpressionAttributeValues: {
          ":location": data.location,
        },
        ReturnValues: "UPDATED_NEW",
      })
    );
    return {
      statusCode: 200,
      body: JSON.stringify(itemResponse.Attributes),
    };
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Please provide right args" }),
    };
  }
}
