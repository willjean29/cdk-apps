import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { handler } from "../../../src/services/spaces/handler";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { captureAWSClient } from "aws-xray-sdk-core";

const someItems = [
  {
    id: "123",
    location: "Paris",
  },
];

jest.mock("aws-xray-sdk-core", () => {
  return {
    captureAWSClient: jest.fn().mockImplementation((client) => client),
  };
});

jest.mock("@aws-sdk/lib-dynamodb", () => {
  const originalModule = jest.requireActual("@aws-sdk/lib-dynamodb");
  return {
    ...originalModule,
    DynamoDBDocumentClient: {
      from: jest.fn().mockReturnValue({
        send: jest.fn().mockImplementation(() => {
          return {
            Items: someItems,
          };
        }),
      }),
    },
  };
});

describe("Spaces handler test suite", () => {
  test("Returns spaces from dynamoDb", async () => {
    const dbClient = captureAWSClient(new DynamoDBClient({}));
    const dbDocumentClient = DynamoDBDocumentClient.from(dbClient);
    const result = await handler(
      {
        httpMethod: "GET",
      } as any,
      {} as any
    );
    expect(result.statusCode).toBe(200);
    const expectedResult = [
      {
        id: "123",
        location: "Paris",
      },
    ];
    const parsedResultBody = JSON.parse(result.body);
    expect(parsedResultBody).toEqual(expectedResult);
    expect(dbDocumentClient.send).toHaveBeenCalled();
  });
});
