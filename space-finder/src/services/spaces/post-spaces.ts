import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";

export async function postSpace(event: APIGatewayProxyEvent, dbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
  console.log({ body: event.body });
  const id = v4();
  const item = JSON.parse(event.body);
  item.id = id;
  const result = await dbClient.send(
    new PutItemCommand({
      TableName: process.env.TABLE_NAME,
      Item: {
        id: {
          S: id,
        },
        location: {
          S: item.location,
        },
      },
    })
  );
  console.log({ result });
  return {
    statusCode: 201,
    body: JSON.stringify({ id }),
  };
}
