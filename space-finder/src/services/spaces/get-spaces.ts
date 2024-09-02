import { DynamoDBDocumentClient, ScanCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function getSpaces(event: APIGatewayProxyEvent, dbClient: DynamoDBDocumentClient): Promise<APIGatewayProxyResult> {
  const params = event.queryStringParameters;
  if (params && params.id) {
    const spaceId = params.id;
    const itemResponse = await dbClient.send(
      new GetCommand({
        TableName: process.env.TABLE_NAME,
        Key: { id: spaceId },
      })
    );
    if (!itemResponse.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Item not found" }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(itemResponse.Item),
    };
  }
  const result = await dbClient.send(new ScanCommand({ TableName: process.env.TABLE_NAME }));
  console.log({ result });
  return {
    statusCode: 200,
    body: JSON.stringify(result.Items),
  };
}
