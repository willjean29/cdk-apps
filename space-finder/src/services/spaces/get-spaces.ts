import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function getSpaces(event: APIGatewayProxyEvent, dbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
  const result = await dbClient.send(new ScanCommand({ TableName: process.env.TABLE_NAME }));
  console.log({ result });
  return {
    statusCode: 200,
    body: JSON.stringify(result.Items),
  };
}
