import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";

export async function postSpace(event: APIGatewayProxyEvent, dbClient: DynamoDBDocumentClient): Promise<APIGatewayProxyResult> {
  console.log({ body: event.body });
  const id = v4();
  const item = JSON.parse(event.body);
  item.id = id;
  const result = await dbClient.send(
    new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: item,
    })
  );
  console.log({ result });
  return {
    statusCode: 201,
    body: JSON.stringify({ id }),
  };
}
