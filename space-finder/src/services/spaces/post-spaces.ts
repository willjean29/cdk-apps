import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";
import { SpaceModel } from "../models/space.model";
import { validateAsSpaceModel } from "../shared/validators";
import { createRandomId, parseJSON } from "../shared/utils";

export async function postSpace(event: APIGatewayProxyEvent, dbClient: DynamoDBDocumentClient): Promise<APIGatewayProxyResult> {
  console.log({ body: event.body });
  const id = createRandomId();
  const item = parseJSON<SpaceModel>(event.body);
  item.id = id;
  validateAsSpaceModel(item);
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
