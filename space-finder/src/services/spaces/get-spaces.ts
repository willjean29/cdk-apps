import { DynamoDBClient, GetItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyEventQueryStringParameters } from "aws-lambda";

export async function getSpaces(event: APIGatewayProxyEvent, dbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
  const params = event.queryStringParameters;
  if (params && params.id) {
    const spaceId = params.id;
    const itemResponse = await dbClient.send(
      new GetItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: { id: { S: spaceId } },
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
  return {
    statusCode: 200,
    body: JSON.stringify(result.Items),
  };
}
